const { Movie, validate} = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();

//Get all movies
router.get('/', async(req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

//Get single movie
router.get('/:id', async(req, res) => {
    //Find movie by id
    const movie = await Movie.findById(req.params.id);
    //If not return 404 error
    if(!movie) return res.status(404).send('The movie with the given Id was not found');
    res.send(movie);
});

//Add new movie
router.post('/', async (req, res) => {
    //Validate body of request
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Gent genre
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre.');
    //Add movie to DB
    const movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });

    await movie.save();

    res.send(movie);

});

//Update movie
router.put('/:id', async(req, res) => {
    //Validate body of request
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Gent genre
    const genre = Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre.');
    //Add movie to DB
    let movie = {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    };
    //Look for movie and update
    movie = await Movie.findByIdAndUpdate(req.params.id, movie, { new: true});
    //If not return 404
    if(!movie) return res.status(404).send('The movie with the given Id was not found');
    res.send(movie);
});

//Delete movie
router.delete('/:id', async(req, res) => {
    //Find movie and delete from DB
    const movie = await Movie.findByIdAndRemove(req.params.id);
    //If not return 404 error
    if(!movie) return res.status(404).send('The customer with the given Id was not found');
    //Send deleted movie
    res.send(movie);
});

module.exports = router;
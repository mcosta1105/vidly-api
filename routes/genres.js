const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    }
}));


// Get all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres)
});

// Get single genre
router.get('/:id', async (req, res) => {
    //Find genre by id
    const genre = await Genre.findById(req.params.id);
    //If not return 404 error
    if(!genre) return res.status(404).send('The genre with the given Id was not found');
    res.send(genre);
});

// Add new genre
router.post('/', async (req, res) => {
    //Validate body of request
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // Add genre do DB
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.send(genre);
});

// Update genre
router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);
    if( error ) return res.status(400).send(error.details[0].message);
    //Look up the genre and update
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    //If not return 404
    if(!genre) return res.status(404).send('The genre with the given Id was not found');

    res.send(genre);
});

// Delete genre
router.delete('/:id', async (req, res) => {
    // Look up genre and remove
    const genre = await Genre.findByIdAndRemove(req.params.id);
    //If not return 404
    if(!genre) return res.status(404).send('The genre with the given Id was not found');
    // Return deleted genre
    res.send(genre);
});

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}


module.exports = router;
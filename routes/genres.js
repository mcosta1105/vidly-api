const auth = require('../middleware/auth');
const { Genre, validate } = require('../models/genre');
const express = require('express');
const router = express.Router();

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
router.post('/', auth, async (req, res) => {
    //Validate body of request
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // Add genre do DB
    const genre = new Genre({ name: req.body.name });
    await genre.save();

    res.send(genre);
});

// Update genre
router.put('/:id',auth, async (req, res) => {
    const { error } = validate(req.body);
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

module.exports = router;
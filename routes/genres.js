const Joi = require('joi');
const express = require('express');
const router = express.Router();

const genres = [
    {id:1, name: 'Comedy'},
    {id:2, name: 'Romance'},
    {id:3, name: 'Action'}
]

// Get all genres route
router.get('/', (req, res) => {
    res.send(genres)
});

// Get single genre
router.get('/:id', (req, res) => {
    const genre = genres.find( g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The genre with the given Id was not found');
    res.send(genre);
});

// Add new genre
router.post('/', (req, res) => {
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const genre = {
        id: genres.length +1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

// Update genre
router.put('/:id', (req, res) => {
    //Look up the genre
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    //If not return 404
    if(!genre) return res.status(404).send('The genre with the given Id was not found');
    
    const { error } = validateGenre(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    //Update genre
    genre.name = req.body.name;
    res.send(genre);
});

// Delete genre
router.delete('/:id', (req, res) => {
    // Look up genre
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    //If not return 404
    if(!genre) return res.status(404).send('The genre with the given Id was not found');
    // Delete
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    // Return deleted genre
    res.send(genre);
});

function validateGenre(genre) {
    const schema = {
        name: Joi.string().main(3).required()
    };

    return Joi.validate(genre, schema);
}


module.exports = router;
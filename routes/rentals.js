const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const express = require('express');
const router = express.Router();
const moongose = require('mongoose');
const Fawn = require('fawn');

Fawn.init(moongose);

//Create a new rental
router.post('/', async(req ,res) => {
    //Validate body of request
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Get customer by id
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer.');
    //Get movie by id
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie.');
    //Check if movie is in the stock
    if(movie.numberInStock === 0) return res.status(400).send('Movie not available');

    
    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id}, {
                $inc: { numberInStock: -1}
            })
            .run();
    
        res.send(rental);
    } catch (ex) {
        res.status(500).send('Something failed.')
    }
});

//Get all rentals
router.get('/', async(req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});
module.exports = router;
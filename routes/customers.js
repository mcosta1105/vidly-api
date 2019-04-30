const { Customer, validate } = require('../models/customer');
const express = require('express');
const router = express.Router();



// Get all customers
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers)
});

// Get single customer
router.get('/:id', async (req, res) => {
    //Find customer by id
    const customer = await Customer.findById(req.params.id);
    //If not return 404 error
    if(!customer) return res.status(404).send('The customer with the given Id was not found');
    res.send(customer);
});

// Add new customer
router.post('/', async (req, res) => {
    //Validate body of request
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // Add customer do DB
    let customer = new Customer({ 
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone 
    });
    customer = await customer.save();

    res.send(customer);
});

// Update customer
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    let customer = {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone 
    };
    
    //Look up the customer and update
    customer = await Customer.findByIdAndUpdate(req.params.id, customer, { new: true });
    //If not return 404
    if(!customer) return res.status(404).send('The customer with the given Id was not found');

    res.send(customer);
});

// Delete customer
router.delete('/:id', async (req, res) => {
    // Look up customer and remove
    const customer = await Customer.findByIdAndRemove(req.params.id);
    //If not return 404
    if(!customer) return res.status(404).send('The customer with the given Id was not found');
    // Return deleted customer
    res.send(customer);
});

module.exports = router;
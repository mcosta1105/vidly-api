const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const config = require('config');

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

//DB Connection
mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true, useCreateIndex: true })
    .then(()=> console.log('Connected to MongoBD...'))
    .catch(err => console.error(`Could not connect do DB..., ${err}`));

//routes
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

//Middlewares
app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`) );
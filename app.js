const mongoose = require('mongoose');
const express = require('express');
const app = express();

//DB Connection
mongoose.connect('mongodb://localhost/vidly')
    .then(()=> console.log('Connected to MongoBD...'))
    .catch(err => console.error(`Could not connect do DB..., ${err}`));

//routes
const genres = require('./routes/genres');

//Middlewares
app.use(express.json());

app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`) );
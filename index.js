const Joi = require('joi'); //Joi is a class, so we should name it with Pascal convention
const dotenv = require('dotenv');
const mongoose = require('mongoose'); //API to work with Mongo
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies'); 
const express = require('express');

const app = express();

app.use(express.json()); //a middleware that enables express to handle json
app.use('/api/genres', genres); 
app.use('/api/customers', customers); 
app.use('/api/movies', movies); 


mongoose.connect('mongodb://localhost/video')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Couldnt connect to MongoDB')); 

dotenv.config({path: '.env'}); 
const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`Server is running on port ${port} `)); 
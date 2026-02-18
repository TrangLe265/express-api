const Joi = require('joi'); //Joi is a class, so we should name it with Pascal convention
const dotenv = require('dotenv');
const mongoose = require('mongoose'); //API to work with Mongo
const genres = require('./routes/genres')
const express = require('express');
const app = express();

app.use(express.json()); //a middleware that enables express to handle json
app.use('/api/genres', genres); 


mongoose.connect('mongodb://localhost/video')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Couldnt connect to MongoDB')); 
dotenv.config({path: '.env'}); 
const port = process.env.PORT || 3000; 
console.log(port);
app.listen(port, () => console.log(`Server is running on port ${port} `)); 
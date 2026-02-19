const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre'); 

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
    }, 
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre', 
        required: true
    }, 
    quantityInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 300
    }, 
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 300
    }, 
    weeklyRentalRate: {
        type: Number,
        required: false,
        min: 0,
        max: 300
    }
}); 

const Movie = mongoose.model('Movie', movieSchema); 

function validateMovie(movie){
    const schema = Joi.object({
        title: Joi.string().min(1).max(50).required(),
        genre: Joi.string().required(), 
        quantityInStock: Joi.number().min(0).max(300).required(),
        dailyRentalRate: Joi.number().min(0).max(300).required(),
        weeklyRentalRate:Joi.number().min(0).max(300)
    });

    return schema.validate(movie); 

}; 

exports.Movie = Movie; 
exports.validate = validateMovie; 
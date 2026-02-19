const express = require('express'); 
const { Movie, validate} = require('../models/movie'); 
const validateObjId = require('../middleware/validateObjId');
const { Genre } = require('../models/genre');
const router = express.Router();

router.get('/', async (req,res) => {
    const movies = await Movie.find()
        .populate('genre') //so that genre is shown as a whole
        .select('-__v')
        .sort("title"); 

    res.send(movies); 
}); 

router.post('/', async(req,res) => {
    const {error} = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message); 

    const genre = await Genre.findById(req.body.genre);
    if (!genre) return res.status(400).send("Invalid genre"); 

    let movie = new Movie({
        title: req.body.title,
        genre: genre._id,
        quantityInStock: req.body.quantityInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        weeklyRentalRate: req.body.weeklyRentalRate,
    }); 

    movie = await movie.save(); 
    
    res.send(movie); 

})

router.put('/:id', validateObjId ,async (req,res) => {
    const {error} = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message); 

    const genre = await Genre.findById(req.body.genre);
    console.log(`Genre id is: `,genre._id)
    if (!genre) return res.status(400).send("Invalid genre");

    let movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            genre: genre._id,
            quantityInStock: req.body.quantityInStock,
            dailyRentalRate: req.body.dailyRentalRate,
            weeklyRentalRate: req.body.weeklyRentalRate
        },
        {
            new: true
        }
    );

    if (!movie) return res.status(404).send("No resources found with the given ID");

    res.send(movie); 
})

router.delete('/:id', validateObjId, async (req,res) => {
    const result = await Movie.findByIdAndDelete(req.params.id); 

    if (!result) return res.status(404).send("No resource found with this ID.");

    res.status(200).send("Successfully delete"); 
})

router.get('/:id', validateObjId, async (req,res) => {
    const movie = await Movie.findById(req.params.id).select("-__v");

    if (!movie)return res.status(404).send("No resource found with this ID.");

    res.send(movie); 
});
module.exports = router; 
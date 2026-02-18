const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre'); 
const validateObjId = require('../middleware/validateObjId'); 

router.get('/', async (req,res) => {
    const genres = await Genre.find()
        .select("-__v") // select("-__v") = do not include version of the object when sending info back
        .sort("name");

    res.send(genres); 
  
}); 

router.put('/:id',validateObjId ,async(req,res) => {
    const {error} = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message); 

    const genre = await Genre.findByIdAndUpdate(
        req.params.id, 
        {name : req.body.name } , 
        {
            new: true //db returns old obj by default, here we tell db to return the updated one instead
        }
    );

    if (!genre) return res.status(404).send(`No resource found with the provided id`);

    res.send(genre); 
}); 

router.post('/', async(req,res) => {
    const {error} = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({name: req.body.name}); 
    genre = await genre.save(); 

    res.send(genre); 
}); 

router.delete('/:id', validateObjId, async(req,res) => {
    const result = await Genre.findByIdAndDelete(req.params.id); 

    if (!result) return res.status(404).send(`No resource found with the provided id`); 

    res.status(200).send(`Successfully delete`); 
}); 

router.get('/:id',validateObjId,async(req,res) => {
    const genre = await Genre.findById(req.params.id).select("-__v"); 

    if (!genre) return res.status(404).send(`No resource found with the provided id`); 

    res.send(genre);
}); 

module.exports = router; 
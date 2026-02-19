const express = require('express');  
const {Customer, validate} = require('../models/customer'); 
const validateObjId = require('../middleware/validateObjId');
const router = express.Router();

router.get('/',async (req,res) => {
    const customers = await Customer.find()
        .select("-___v")
        .sort("name");

    res.send(customers); 
}); 

router.post('/', async (req,res) => {
    //use the validate method to find possible error
    //destruct the error property
    const {error} = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message); 
    
    //create a new Customer, an instance of the Mongoose model
    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }); 
    //now customer instance ineherits all the available Moongoose methods, like save(), remove() etc

    //save the customer to the database
    customer = await customer.save(); 

    res.send(customer); 
})

router.put('/:id',validateObjId ,async (req,res) => {
    const {error} = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message); 

    const customer = await Customer.findByIdAndUpdate(
       req.params.id,
       {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
       },
       {
        new: true, 
       }
    ); 

    if (!customer) return res.status(404).send(`No resource found with the provided id`); 

    res.send(customer); 

}); 

router.delete('/:id', validateObjId, async(req, res) => {
    const result = await Customer.findOneAndDelete(req.params.id); 

    if (!result) return res.status(404).send(`No resource found with the provided id`); 

    res.status(200).send("Successfully delete customer"); 

}); 

router.get('/:id', validateObjId, async(req, res) => {
    const customer = await Customer.findById(req.params.id).select("-___v");
    
    if (!customer) return res.status(404).send(`No resource found with the provided id`); 

    res.send(customer); 
})

module.exports = router; 
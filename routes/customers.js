const { Customer, validate } = require('../models/customer');
const express = require('express');
const customersRouter = express.Router();

// getting all customers
customersRouter.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
})

// creating a new customer
customersRouter.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customer.save();

    res.send(customer);
})

// updating a customer by id
customersRouter.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        }
    )

    if (!customer) return res.status(404).send('the cutomer with the given ID was not found');
    res.send(customer);
})

// delete a customer by id
// TODO
module.exports = customersRouter;
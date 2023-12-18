const Fawn = require('fawn');
const express = require('express');
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const rentalsRouter = express.Router();

Fawn.init('mongodb://localhost/vidly');

// Get the list of rentals
rentalsRouter.get('/', async (req, res) => {
    const rentals = await Rental
        .find()
        .sort('-dateOut');

    res.send(rentals);
});

// Create a new Rental
rentalsRouter.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            rental = await rental.save();
            
            movie.numberInStock--;
            await movie.save();
            
            res.send(rental);
        });

        session.endSession();
        console.log('success');
    }
    catch (error) {
        res.status(500).send('Something failed.');
    }
});

module.exports = rentalsRouter;
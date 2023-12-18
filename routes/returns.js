const Joi = require('joi');
require('joi-objectid');
const auth = require('../middleware/auth')
const validate = require('../middleware/validate')
const express = require('express');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const returnsRouter = express.Router();



returnsRouter.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    
    if (!rental) return res.status(404).send('there is no rental with the given customer/movie');

    if (rental.dateReturned) return res.status(400).send('Return is already processed');

    rental.return();
    await rental.save();
    
    await Movie.updateMany({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    return res.send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });

    return schema.validate(req);
}

module.exports = returnsRouter;
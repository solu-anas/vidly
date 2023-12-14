const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 300
    },
    phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 300
    }
}));

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(300).required(),
        phone: Joi.string().min(5).max(300).required(),
        isGold: Joi.boolean()
    });

    return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
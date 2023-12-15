const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, validate } = require('../models/genre');
const express = require('express');
const genresRouter = express.Router();


// Getting all genres
genresRouter.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

// Getting a genre by ID
genresRouter.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send("The genre with the given ID does not exist");

    res.send(genre);
});

// Create a genre
genresRouter.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);
});

// Update a genre by their id
genresRouter.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if (!genre) return res.status(404).send('The genre with the given ID does not exist');

    res.send(genre);
});

// Delete a genre
genresRouter.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID does not exist.');
    res.send(genre);
});

module.exports = genresRouter;
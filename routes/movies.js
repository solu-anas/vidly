const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const moviesRouter = express.Router();

// getting all movies
moviesRouter.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

// getting a movie by Id
moviesRouter.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) res.status(404).send('The Movie with the given ID was not found');

    res.send(movie);
});

// create a movie
moviesRouter.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid Genre.');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    
    await movie.save();
    
    res.send(movie);
});

// update a movie by id
moviesRouter.put('/:id', async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid Genre.');
    
    let movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

    movie = await movie.save();
    if (!movie) res.status(404).send('The Movie with the given ID was not found');

    res.send(movie);
});

// delete a movie by id
moviesRouter.delete('/:id', async (req, res) => {
    
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) res.status(404).send('The Movie with the given ID was not found');

    res.send(movie);
});

module.exports = moviesRouter;
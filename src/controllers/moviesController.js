const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include:[{
                association: 'genero',
                required: true
            }]
        })
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res, next) {
        db.Genre.findAll()
        .then(genres => {
            res.render('moviesAdd', { allGenres: genres });
        })
        .catch(err => {
            console.error(err)
            next(err)
        }) 
        
    },
    create: function (req,res) {
        const movieInfo = req.body
        console.log(movieInfo)
        db.Movie.create(movieInfo)
            .then(movieCreated => {
                console.log(movieCreated);
                res.redirect('/movies')
            })
    },
    edit: async function(req,res) {
        const movieId = req.params.id
        const movie =  await db.Movie.findByPk(movieId, {
            include: [{
                association: 'genero'
            }]
        })
        const allGenres = await db.Genre.findAll()
        res.render('moviesEdit', { Movie: movie, allGenres })
        
    },
    update: async function (req,res) {
        const movieId = req.params.id
        const movieInfo = req.body
        console.log(movieInfo)
        const movieActualizado = await db.Movie.update(movieInfo, {
            where: {
                id: movieId
            }
        })
        
        res.redirect('/movies')
    },
    delete: function (req,res) {

    },
    destroy: function (req,res) {

    }
}

module.exports = moviesController;
const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
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
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render('moviesAdd')
    },
    create: function (req, res) {
        const {title, rating, release_date, length, awards} = req.body
       Movies.create({
           title,
           rating,
           release_date,
           length,
           awards
       }).then(movie =>{
           res.redirect('/movies')     
       })
       .catch((error)=>{
           res.send(error)
       })
    },
    edit: function(req, res) {
        db.Movie.findByPk(req.params.id)
        .then((Movie)=> {
            res.render('moviesEdit',{
                Movie
            })
        })
        .catch((error)=>{
            res.send(error)
        })
    },
    update: function (req,res) {
        const {title, rating, release_date, length, awards} = req.body
      
        db.Movie.update({
            title, rating, release_date, length, awards
        },{
            where: {
                id: req.params.id
            }
        })
        .then((result)=>{
            if(result){
                res.redirect('/movies')
            } 
        })
        .catch((error)=>{
            res.send(error)
        })
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
        .then((Movie)=>{
            res.render('moviesDelete',{
                Movie
            })
        })
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where:{
                id: req.params.id,
            }
        })
       .then((result)=>{
            console.log(result)
            res.redirect('/movies')
        }) 
    }

}

module.exports = moviesController;
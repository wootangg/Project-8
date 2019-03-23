var express = require('express');
var router = express.Router();
var Books = require('../models').Book;

/* GET books listing. */
router.get('/', function(req, res, next) {
  Books.findAll({order: [["createdAt", "DESC"]] }).then(function(books) {
    res.render('index', {books: books, title: 'Books'});
  }).catch(function(err) {
    res.send(500);
  });
});

/* GET create new Book */
router.get('/new', function(req, res, next) {
  res.render('new-book', {book: Books.build() });
});

/* POST create new Book */
router.post('/new', function(req, res, next) {
  Books.create(req.body).then(function(){
    res.redirect('/');
  }).catch(function(err){
    if(err.name === "SequelizeValidationError") {
      res.render('new-book', {
        book: Books.build(req.body),
        title: "New title",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err) {
    res.send(500);
  });;
});

/* GET individual book */
router.get('/:id', function(req, res, next) {
  Books.findByPk(req.params.id).then(function(book){
    if(book) {
      res.render('update-book', {book: book, title: book.title, id: req.params.id});
    } else {
      res.render('page-not-found');
    }
  }).catch(function(err) {
    res.send(500);
  });
});

/* POST update individual book */
router.post('/:id/update', function(req, res, next) {
  Books.findByPk(req.params.id).then(function(book){
    if(book) {
      return book.update(req.body);
    } else {
      res.render('page-not-found');
    }
  }).then(function() {
    res.redirect('/');
  }).catch(function(err){
    if(err.name === "SequelizeValidationError") {
      var book = Books.build(req.body);
      book.id = req.params.id;

      res.render('update-book', {
        book: book,
        title: "Update title",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err) {
    res.send(500);
  });;
});

/* POST delete individual book */
router.post('/:id/delete', function(req, res, next) {
  Books.findByPk(req.params.id).then(function(book){
    if(book) {
      return book.destroy();
    } else {
      res.render('page-not-found');
    }
  }).then(function() {
    res.redirect('/');
  }).catch(function(err) {
    res.send(500);
  });;
});



module.exports = router;
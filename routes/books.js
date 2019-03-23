var express = require('express');
var router = express.Router();
var Books = require('../models').Book;

/* GET books listing. */
router.get('/', function(req, res, next) {
  Books.findAll({order: [["createdAt", "DESC"]] }).then(function(books) {
    res.render('index', {books: books, title: 'Books'});
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
  });
});

/* GET individual book */
router.get('/:id', function(req, res, next) {
  Books.findByPk(req.params.id).then(function(book){
    res.render('update-book', {book: book, title: book.title, id: req.params.id});
  });
});

/* POST update individual book */
router.post('/:id/update', function(req, res, next) {
  Books.findByPk(req.params.id).then(function(book){
    return book.update(req.body);
  }).then(function() {
    res.redirect('/');
  });
});

/* POST delete individual book */
router.post('/:id/delete', function(req, res, next) {
  Books.findByPk(req.params.id).then(function(book){
    return book.destroy();
  }).then(function() {
    res.redirect('/');
  });
});



module.exports = router;
'use strict';

var express = require('express');
// eslint-disable-next-line new-cap
var router = express.Router();
var knex = require('../knex');
var bodyParser = require('body-parser');
var { camelizeKeys, decamelizeKeys } = require('humps');

router.use(bodyParser.json());

// YOUR CODE HERE
router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((bookSnake) => {
      var books = camelizeKeys(bookSnake);
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((bookSnake) => {
      var book = camelizeKeys(bookSnake);

      if (!book) {
        return next();
      }
      res.send(book);

    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  knex('books')
    // .where('id', req.body.book_id)
      .insert({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.coverUrl
      }, '*')
    .then((bookSnake) => {
      var book = camelizeKeys(bookSnake);
      res.send(book[0]);
    })
    .catch((err) => {
      next(err);
    });
});


router.patch('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }

      return knex('books')
        .update({
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          description: req.body.description,
          cover_url: req.body.coverUrl
        }, "*")
        .where('id', req.params.id)
    })
    .then((bookSnake) => {
      var book = camelizeKeys(bookSnake);
      res.send(book[0]);
    })
    .catch((err) => {
      next(err);
    });
});

// router.patch('/books/:id', (req, res, next) => {
//
//   knex('books')
//     .where('id', req.params.id)
//     .first()
//     .update({
//       title: req.body.title,
//       author: req.body.author,
//       genre: req.body.genre,
//       description: req.body.description,
//       cover_url: req.body.coverUrl
//     }, "*")
//
//     .then((bookSnake) => {
//       var book = camelizeKeys(bookSnake);
//
//       res.send(book[0]);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

router.delete('/books/:id', (req, res, next) =>{
  var index = req.params.id;
  var bookCamel;

  knex('books')
    .where('id', index)
    .first()
    .then((bookSnake) => {
      if (!bookSnake) {
        return next();
      }

      bookCamel = camelizeKeys(bookSnake);

      return knex('books')
        .del()
        .where('id', index);
    })
    .then(() => {
      delete bookCamel.id;
      res.send(bookCamel);
    })
    .catch((err) => {
      next(err);
    });

});

//headers
// router.set('Content-Type', 'text/plain');

module.exports = router;

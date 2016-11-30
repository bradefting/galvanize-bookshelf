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
      res.sendStatus(200);
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
      res.sendStatus(200);
    })
    .catch((err) => {
      next(err);
    });
});

// router.post('/artists', (req, res, next) => {
//   console.log(req.body.name);
//   console.log(req.body.profile_url);
//   knex('artists')
//     .insert({
//       name: req.body.name,
//       profile_url: req.body.profile_url
//       }, '*')
//     .then((artists) => {
//       res.send(artists[0]);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

//headers
// router.set('Content-Type', 'text/plain');

module.exports = router;

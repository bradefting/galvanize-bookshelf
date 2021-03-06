'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const bodyParser = require('body-parser');
const { camelizeKeys, decamelizeKeys } = require('humps');

router.use(bodyParser.json());

// YOUR CODE HERE
router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((bookSnakeCase) => {
      let books = camelizeKeys(bookSnakeCase);
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  let index = parseInt(req.params.id);

  if(isNaN(index)|| index<0){
    res.sendStatus(404);
  }

  knex('books')
    .where('id', index)
    .first()
    .then((bookSnakeCase) => {
      let book = camelizeKeys(bookSnakeCase);

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
    .then((bookSnakeCase) => {
      let book = camelizeKeys(bookSnakeCase);
      res.send(book[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  let index = parseInt(req.params.id);

  if(isNaN(index) || index<0){
    res.sendStatus(404);
  }

  knex('books')
    .where('id', index)
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
        .where('id', index)
    })
    .then((bookSnakeCase) => {
      let book = camelizeKeys(bookSnakeCase);
      res.send(book[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) =>{
  let index = parseInt(req.params.id);
  let bookCamel;

  if(isNaN(index) || index<0){
    res.sendStatus(404);
  }

  knex('books')
    .where('id', index)
    .first()
    .then((bookSnakeCase) => {
      if (!bookSnakeCase) {
        return next();
      }

      bookCamel = camelizeKeys(bookSnakeCase);

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

module.exports = router;

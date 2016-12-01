'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const { camelizeKeys, decamelizeKeys } = require('humps');

router.post('/users', (req, res, next) => {
  bcrypt.hash(req.body.password, 8)
    .then((hashed_password) => {
         return knex('users')
          .insert({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            hashed_password: hashed_password
          }, '*');
      })
     .then((userSnake) => {
       const user = camelizeKeys(userSnake);
       delete user[0].hashedPassword;
       res.send(user[0]);
     })
     .catch((err) => {
       next(err);
     });
});

module.exports = router

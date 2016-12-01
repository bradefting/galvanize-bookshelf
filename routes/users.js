'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

router.post('/users', (req, res, next) => {

 knex('users')
     .insert({
       first_name: req.body.first_name,
       last_name: req.body.last_name,
       email: req.body.email,
       hashed_password: req.body.password
     }, '*')
   .then((userSnakeCase) => {
     var user = camelizeKeys(userSnakeCase);
     res.send(user[0]);
   })
   .catch((err) => {
     next(err);
   });
});

module.exports = router

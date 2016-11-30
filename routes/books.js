'use strict';

var express = require('express');
// eslint-disable-next-line new-cap
var router = express.Router();
var knex = require('../knex');
var bodyParser = require('body-parser');

router.use(bodyParser.json());

// YOUR CODE HERE

module.exports = router;

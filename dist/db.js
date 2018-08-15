'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mongoose = require('mongoose');
var Redis = require('ioredis');

const options = {
  useNewUrlParser: true,
};
const connection = mongoose.connect(
  process.env.MONGODB_URI,
  options
);

const redis = new Redis(process.env.REDIS_URL);

exports.mongo = connection;
exports.redis = redis;

const root = require('./root');
const users = require('./users');
const messages = require('./messages');

const schemas = [
  root,
  users,
  messages,
];

module.exports = schemas;

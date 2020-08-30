const users = require('./users');
const messages = require('./messages');

const resolvers = {
  Message: {
    createdAt: (message) => message.createdAt.toISOString(),
  },
  Query: {
    ...users.Query,
    ...messages.Query,
  },
  Mutation: {
    ...users.Mutation,
    ...messages.Mutation,
  },
};

module.exports = resolvers;

const { ApolloServer } = require('apollo-server');

const typeDefs = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');
const { sequelize } = require('./models');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (ctx) => ctx,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);

  sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch((err) => console.log(err));
});

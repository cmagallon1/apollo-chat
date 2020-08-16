const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;

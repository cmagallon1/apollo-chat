const { gql } = require('apollo-server')

module.exports = gql`
  type User {
    username: String!
    email: String!
  }

  extend type Query {
    users: [User]!
  }

  extend type Mutation {
    register(input: registerInput): User
  }

  input registerInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
`;


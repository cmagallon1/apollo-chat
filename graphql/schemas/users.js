const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    username: String!
    email: String!
    token: String
    createdAt: String!
  }

  extend type Query {
    users: [User]!
  }

  extend type Mutation {
    register(input: registerInput): User
    login(input: loginInput): User
  }

  input loginInput {
    username: String!
    password: String!
  }

  input registerInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
`;


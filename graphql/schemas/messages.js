const { gql } = require('apollo-server');

module.exports = gql`
  extend type Mutation {
    sendMessage(input: sendMessageInput): Message!
  }

  extend type Query {
    getMessages(input : getMessagesInput): [Message]!
  }

  type Message {
    uuid: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
  }

  input sendMessageInput {
    to: String!
    content: String!
  }

  input getMessagesInput {
    from: String!
  }
`;

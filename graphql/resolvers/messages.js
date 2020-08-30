const { AuthenticationError, UserInputError } = require('apollo-server');
const { Op } = require('sequelize');

const { Message, User } = require('../../models');

const resolvers = {
  Query: {
    getMessages: async (_, { input }, { user }) => {
      try {
        const { from } = input;
        if (!user) {
          throw AuthenticationError('Unauthenticated');
        }
        const remitent = await User.findOne({ where: { username: from } });
        if (!remitent) {
          throw new UserInputError('User not found');
        }
        const usernames = [user.username, remitent.username];
        const messages = Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [['createdAt', 'DESC']],
        });
        return messages;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { input }, { user }) => {
      try {
        const { to, content } = input;
        if (!user) throw new AuthenticationError('Unauthenticated');
        const recipient = await User.findOne({ where: { username: to } });
        if (!recipient) {
          throw new UserInputError('User not found');
        } else if (recipient.username === user.username) {
          throw new UserInputError('You cant message yourself');
        }
        if (content.trim() === '') {
          throw new UserInputError('Message is empty');
        }
        const message = await Message.create({
          from: user.username,
          to,
          content,
        });
        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};

module.exports = resolvers;

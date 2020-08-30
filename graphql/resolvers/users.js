const bcrypt = require('bcryptjs');
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const { User } = require('../../models');
const { JWT_SECRET } = require('../../config/env.json');

const resolvers = {
  Query: {
    users: async (_, __, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError('Unauthenticated');
        }
        const users = await User.findAll({
          where: {
            username: {
              [Op.ne]: user.username,
            },
          },
        });

        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    register: async (_, { input }) => {
      const {
        username,
        email,
        confirmPassword,
      } = input;
      let { password } = input;
      const errors = {};
      try {
        if (username.trim() === '') {
          errors.username = 'username must not be empty';
        }
        if (password.trim() === '') {
          errors.password = 'password must not be empty';
        }
        if (email.trim() === '') {
          errors.email = 'email must not be empty';
        }
        if (confirmPassword.trim() === '') {
          errors.confirmPassword = 'repeat password must not be empty';
        }

        if (password !== confirmPassword) {
          errors.confirmPassword = 'password must match';
        }

/*        const userByUsername = await User.findOne({ where: { username }});*/
        //const userByEmail = await User.findOne({ where: { email }});

        //if(userByUsername) {
          //errors.username = 'username is taken';
        //}
        //if(userByEmail) {
          //errors.email = 'email is taken';
        /*}*/

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        password = await bcrypt.hash(password, 6);

        const user = await User.create({
          username,
          email,
          password,
        });
        return user;
      } catch (err) {
        console.log(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        } else if (err.name === 'SequelizeValidationError') {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError('Bat input', { errors });
      }
    },
    login: async (_, { input }) => {
      const { username, password } = input;
      const errors = {};
      try {
        if (username.trim() === '') {
          errors.username = 'username must not be empty';
        }

        if (password.trim() === '') {
          errors.password = 'password must not be empty';
        }

        if (Object.keys(errors).length > 0) {
          throw new UserInputError('bad input', { errors });
        }

        const user = await User.findOne({ where: { username } });

        if (!user) {
          errors.username = 'user not found';
          throw new UserInputError('user not found', { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
          errors.password = 'password is incorrect';
          throw new UserInputError('password is incorrect', { errors });
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: 60 * 60 });

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};

module.exports = resolvers;

const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');

const { User } = require('../../models')

const resolvers = {
  Query: {
    users: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    register: async (_, { input }) => {
      let {
        username,
        password,
        email,
        confirmPassword,
      } = input;
      const errors = {};
      try {
        //TODO: validate input data
        //TODO: create if username / email exists
        //TODO: create user
        if(username.trim() === '') {
          errors.username = 'username must not be empty';
        } 
        if(password.trim() === '') {
          errors.password = 'password must not be empty';
        }
         if(email.trim() === '') {
          errors.email = 'email must not be empty';
        }
        if(confirmPassword.trim() === '') {
          errors.password = 'repeat password must not be empty';
        }
        if(password !== confirmPassword) {
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

        if(Object.keys(errors).length > 0) {
          throw errors;
        }
        
        password = await bcrypt.hash(password, 6);
        
        const user = await User.create({
          username,
          email,
          password,
        });
        return user;
      } catch(err) {
        console.log(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        } else if (err.name === 'SequelizeValidationError') {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError('Bat input', { errors });
      }
    }
  }
}

module.exports = resolvers

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'password',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    );
    await queryInterface.addColumn(
      'users',
      'imageUrl',
      {
        type: Sequelize.STRING,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'password');
    await queryInterface.removeColumn('users', 'imageUrl');
  },
};

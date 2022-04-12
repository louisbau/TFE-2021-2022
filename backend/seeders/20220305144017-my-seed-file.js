'use strict';
const bcrypt = require("bcrypt");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: 'admin',
      email: 'admin@gmail.com',
      password : bcrypt.hash('1234', 12),
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'admin1',
      email: 'admin1@gmail.com',
      password : bcrypt.hash('1234', 12),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};

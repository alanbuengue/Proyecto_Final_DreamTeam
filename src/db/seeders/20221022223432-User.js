'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      name: "Alan",
      email: "alanbuengue@gmail.com",
      password: "hola123",
      isAdmin: 1 ,
      idPlot: 1 ,
    createdAt: new Date,
    updatedAt: new Date
    },
    {
      name: "Alejo",
      email: "alejo.curello@gmail.com",
      password: "123456",
      isAdmin: 0 ,
      idPlot: 2 ,
    createdAt: new Date,
    updatedAt: new Date
    }], {});
    },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Users', null, {});
     
  }
};


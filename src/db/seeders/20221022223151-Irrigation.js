'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Irrigations', [{
    waterUsed: 50,
    idPlot: 1,
    createdAt: new Date,
    updatedAt: new Date
    },
  {
    waterUsed: 150,
    idPlot: 1,
    createdAt: new Date,
    updatedAt: new Date
  },
  {
    waterUsed: 100,
    idPlot: 1,
    createdAt: new Date,
    updatedAt: new Date
    },
    {
      waterUsed: 50,
      idPlot: 1,
      createdAt: new Date,
      updatedAt: new Date
      },], {});
    },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Irrigations', null, {});
     
  }
};

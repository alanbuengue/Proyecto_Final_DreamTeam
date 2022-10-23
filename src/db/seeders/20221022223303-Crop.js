'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Crops', [{
    cropType: "Trigo",
    minus_temp: 1,
    minus_ph: 3 ,
    max_humidity: 3 ,
    createdAt: new Date,
    updatedAt: new Date
    }], {});
    },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Crops', null, {});
     
  }
};

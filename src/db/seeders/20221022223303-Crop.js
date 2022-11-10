'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Crops', [{
    cropType: "Soja",
    minus_temp: 6,
    minus_ph: 4,
    min_humidity: 45,
    max_humidity: 80,
    createdAt: new Date,
    updatedAt: new Date
    },
    {
      cropType: "Maiz",
      minus_temp: 6,
      minus_ph: 4,
      min_humidity: 22,
      max_humidity: 50,
      createdAt: new Date,
      updatedAt: new Date
      
    },
    {
      cropType: "Trigo",
      minus_temp: 6,
      minus_ph: 4,
      min_humidity: 15,
      max_humidity: 40,
      createdAt: new Date,
      updatedAt: new Date
      }], {});
    },
    
    

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Crops', null, {});
     
  }
};

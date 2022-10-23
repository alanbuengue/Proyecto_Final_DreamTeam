'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Plots', [{
    description: 'esta parcela contiene el feudo de mauricio macri',
    idCrop: 1,
    createdAt: new Date,
    updatedAt: new Date
    }], {});
    },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Plots', null, {});
     
  }
};

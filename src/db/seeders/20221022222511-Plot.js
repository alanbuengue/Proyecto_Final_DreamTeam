'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Plots', [{
    description: 'esta parcela contiene el feudo 1',
    idCrop: 1,
    city: 'buenos aires',
    createdAt: new Date,
    updatedAt: new Date
    },
    {
      description: 'Parcela 2 de nuestro cliente mas fiel',
      idCrop: 2,
      city: 'buenos aires',
      createdAt: new Date,
      updatedAt: new Date
      }], {});
    },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Plots', null, {});
     
  }
};

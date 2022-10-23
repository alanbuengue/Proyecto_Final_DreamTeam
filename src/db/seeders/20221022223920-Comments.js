'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Comments', [{
    idIrrigation: 1,
    text: "Se realizo un riego",
    createdAt: new Date,
    updatedAt: new Date
    },
  {
    idIrrigation: 1,
    text: "Se realizo un riego 2",
    createdAt: new Date,
    updatedAt: new Date
  },
{
  idIrrigation: 1,
  text: "Llovio",
  createdAt: new Date,
  updatedAt: new Date
},
{
  idIrrigation: 2,
  text: "Se realizo un riego",
  createdAt: new Date,
  updatedAt: new Date
},
{
  idIrrigation: 2,
  text: "Llovio",
  createdAt: new Date,
  updatedAt: new Date
}], {});
    },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Comments', null, {});
     
  }
};


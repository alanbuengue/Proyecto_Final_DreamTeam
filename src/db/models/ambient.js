'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ambient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ambient.belongsTo(models.Plot, {
        foreignKey: 'idAmbient'
      });
    }
  }
  Ambient.init({
    temp: DataTypes.FLOAT,
    land_humidity: DataTypes.FLOAT,
    land_ph: DataTypes.FLOAT,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ambient',
  });
  return Ambient;
};
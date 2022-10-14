'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Crop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Crop.belongsTo(models.Plot, {
        foreignKey: 'idCrop'
      });
    }
  }
  Crop.init({
    cropType: DataTypes.STRING,
    minus_temp: DataTypes.FLOAT,
    minus_ph: DataTypes.FLOAT,
    max_humidity: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Crop',
  });
  return Crop;
};
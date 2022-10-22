'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Plot.hasMany(models.User, {
        foreignKey: 'idPlot'
      })
      Plot.hasOne(models.Crop, {
        foreignKey: 'idCrop'
      })
      Plot.hasMany(models.Irrigation, {
        foreignKey: 'idPlot'
      })
    }
  }
  Plot.init({
    description: DataTypes.STRING,
    idCrop: DataTypes.INTEGER,
    idAmbient: DataTypes.INTEGER,
    idSensor: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Plot',
  });
  return Plot;
};
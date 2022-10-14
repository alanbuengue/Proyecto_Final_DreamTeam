'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Irrigation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Irrigation.belongsTo(models.Plot, {
        foreignKey: 'idPlot'
      })
      Irrigation.hasMany(models.Comment,{
        foreignKey: 'idIrrigation'
      })
    }
  }
  Irrigation.init({
    waterUsed: DataTypes.FLOAT,
    idPlot: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Irrigation',
  });
  return Irrigation;
};
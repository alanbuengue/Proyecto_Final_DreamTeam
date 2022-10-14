'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sensor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sensor.belongsTo(models.Plot, {
        foreignKey: 'idSensor'
      });

    }
  }
  Sensor.init({
    status: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
    fiware_update_url: DataTypes.STRING,
    ph_measured: DataTypes.FLOAT,
    ac_measured: DataTypes.FLOAT,
    hu_measured: DataTypes.FLOAT,
    fiware_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sensor',
  });
  return Sensor;
};
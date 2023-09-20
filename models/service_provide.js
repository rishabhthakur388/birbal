'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class service_provide extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      service_provide.hasMany(models.products, {
        foreignKey: 'id'
      })
      service_provide.hasMany(models.order, {
        foreignKey: 'id'
      })

    }
  }
  service_provide.init({
    country_code: DataTypes.STRING,
    mobile_number: DataTypes.STRING,
    password: DataTypes.STRING,
    otp: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'service_provide',
  });
  return service_provide;
};
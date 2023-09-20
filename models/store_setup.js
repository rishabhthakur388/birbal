'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class store_setup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  store_setup.init({
    sellers_id: DataTypes.INTEGER,
    image: DataTypes.STRING,
    business_name: DataTypes.STRING,
    business_type: DataTypes.STRING,
    descripition: DataTypes.STRING,
    country_code: DataTypes.STRING,
    mobile_number: DataTypes.STRING,
    whatsapp_support: DataTypes.BOOLEAN,
    business_email: DataTypes.STRING,
    store_address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    zip_code: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'store_setup',
  });
  return store_setup;
};
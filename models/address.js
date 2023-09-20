'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      address.belongsTo(models.order,{
        foreignKey:"id"
      })
      address.belongsTo(models.customers,{
        foreignKey:"id"
      })
      // address.hasMany(models.products,{
      //   foreignKey:"address_id"
      // })
    }
  }
  address.init({
    name: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    address_line1: DataTypes.TEXT,
    address_line2: DataTypes.TEXT,
    landmark: DataTypes.STRING,
    town_city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    pincode: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'address',
  });
  return address;
};
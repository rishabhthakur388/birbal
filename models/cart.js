'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      cart.belongsTo(models.products,{
        foreignKey:'product_id'}),

      cart.belongsTo(models.customers,{
        foreignKey:'id'})


    }
  }
  cart.init({
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER,
    cart_status: {type:DataTypes.ENUM('1','2'),
    defaultValue:"1"}
  }, {
    sequelize,
    modelName: 'cart',
  });
  return cart;
};
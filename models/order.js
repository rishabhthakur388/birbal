'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order.belongsTo(models.products,{
        foreignKey:"product_id"
      })
      order.belongsTo(models.customers,{
        foreignKey:"customer_id"
      })
      order.belongsTo(models.address,{
        foreignKey:"address_id"
      });
      order.belongsTo(models.service_provide,{
        foreignKey:"sellers_id"
      })

    }
  }
  order.init({
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER,
    order_status: { type: DataTypes.ENUM('1', '2','3','4','5'),
    defaultValue:'1'},
    delevery_type: { type: DataTypes.ENUM('1', '2')},
    payment_type: { type: DataTypes.ENUM('1', '2')},
    contact_number: DataTypes.STRING,
    sub_total: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    tax_and_charges: DataTypes.FLOAT,
    delivery_charges: DataTypes.FLOAT,
    total_price: DataTypes.FLOAT,
    address_id: DataTypes.INTEGER,
    order_Cid: DataTypes.STRING,
    sellers_id: DataTypes.INTEGER,
    
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};
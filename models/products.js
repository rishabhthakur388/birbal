'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      products.belongsTo(models.category, {
        foreignKey: 'category_id'
      }),
        products.belongsTo(models.sub_category, {
          foreignKey: 'sub_category_id'
        }),
        products.hasMany(models.cart, {
          foreignKey: 'product_id'
        }),
        products.hasMany(models.order, {
          foreignKey: 'id'
        }),
        products.belongsTo(models.service_provide,{
          foreignKey:'sellers_id'
        })
    }
  }
  products.init({
    sellers_id: DataTypes.STRING,
    image: DataTypes.STRING,
    barcode: DataTypes.STRING,
    product_name: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    sub_category_id: DataTypes.INTEGER,
    mrp: DataTypes.FLOAT,
    selling_price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    quantity_type: DataTypes.STRING,
    product_details: DataTypes.STRING,
    available: DataTypes.BOOLEAN,
    size_color: DataTypes.BOOLEAN,
    size: DataTypes.STRING,
    color: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};
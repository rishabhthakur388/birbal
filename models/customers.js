'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      customers.hasMany(models.cart,{
        foreignKey:'id'
      })
      customers.belongsTo(models.address,{
        foreignKey:"id"
      })
      customers.hasMany(models.order,{
        foreignKey:"customer_id"
      })
    }
  }
  customers.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    mobile_number: DataTypes.STRING,
    dob: DataTypes.STRING,
    gender: { type: DataTypes.ENUM('1', '2', '3')},
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    is_verify: DataTypes.BOOLEAN,
    otp_for_delivery:DataTypes.INTEGER,
    is_verify_delivery:DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'customers',
  });
  return customers;
};
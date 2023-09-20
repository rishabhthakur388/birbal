'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER
      },
      order_status: {
        type: Sequelize.ENUM('1', '2', '3', '4','5'),
        comment: "1 => pending, 2 =>accepted, 3 => rejected, 4 => completed, 5=> cancelled",
      },
      sub_total: {
        type: Sequelize.FLOAT
      },
      discount: {
        type: Sequelize.FLOAT
      },
      tax_and_charges: {
        type: Sequelize.FLOAT
      },
      totalpayable: {
        type: Sequelize.FLOAT
      },
      delevery_type: {
        type: Sequelize.ENUM('1', '2'),
        comment: "1 => pickupatstore, 2 => delivery"
      },
      contact_number: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.STRING
      },
      address_id: {
        type: Sequelize.INTEGER
      },
      order_Cid: {
        type: Sequelize.INTEGER
      },
      payment_type: {
        type: Sequelize.ENUM('1', '2'),
        comment: "1 => COD, 2 => UPI"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
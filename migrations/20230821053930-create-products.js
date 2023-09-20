'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sellers_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'service_provide', key: 'id' },
        onDelete: 'cascade',
      },
      image: {
        type: Sequelize.STRING
      },
      barcode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_name: {
        type: Sequelize.STRING,
        allownull: false
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'categories', key: 'id' }
      },
      sub_category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'sub_categories', key: 'id' },
      },
      mrp: {
        type: Sequelize.STRING
      },
      selling_price: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      quantity_type: {
        type: Sequelize.STRING
      },
      product_details: {
        type: Sequelize.STRING
      },
      available: {
        type: Sequelize.BOOLEAN
      },
      size_color: {
        type: Sequelize.BOOLEAN
      },
      size: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('products');
  }
};
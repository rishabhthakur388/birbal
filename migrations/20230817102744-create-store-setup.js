'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('store_setups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sellers_id: {
        type: Sequelize.INTEGER,
        references: { model: 'service_provides', key: 'id' },
        onDelete: 'cascade',
        allowNull: false
      },
      image: {
        type: Sequelize.STRING
      },
      business_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      business_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descripition: {
        type: Sequelize.STRING
      },
      country_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mobile_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      whatsapp_support: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      business_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      store_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      zip_code: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('store_setups');
  }
};
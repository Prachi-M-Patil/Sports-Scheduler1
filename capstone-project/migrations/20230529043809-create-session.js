"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("session", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nameOfSport: {
        type: Sequelize.INTEGER,
      },
      time: {
        type: Sequelize.DATE,
      },
      sessionsPlace: {
        type: Sequelize.STRING,
      },
      playersName: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      noOfplayers: {
        type: Sequelize.INTEGER,
      },
      sessioncreated: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
 
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("session");
  },
};
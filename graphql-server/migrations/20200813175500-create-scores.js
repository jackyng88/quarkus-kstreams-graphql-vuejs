'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Scores', {
      scoresId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      awayTeamId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      homeTeamId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      awayTeamScore: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      homeTeamScore: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      quarter: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      time: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      gameComplete: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Scores');
  }
};
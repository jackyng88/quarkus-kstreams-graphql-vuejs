'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Scores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Scores.init({
    scoresId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    awayTeamId: DataTypes.INTEGER,
    homeTeamId: DataTypes.INTEGER,
    awayTeamScore: DataTypes.INTEGER,
    homeTeamScore: DataTypes.INTEGER,
    quarter: DataTypes.INTEGER,
    time: DataTypes.INTEGER,
    gameComplete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Scores',
  });
  return Scores;
};
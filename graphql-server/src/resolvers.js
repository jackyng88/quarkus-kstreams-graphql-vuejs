const bcrypt = require('bcryptjs')
//import { pubsub } from './pubsub';
//import { PubSub } from 'apollo-server';
const { PubSub } = require('apollo-server')

const pubsub = new PubSub();

const resolvers = {
    
    Query: {
        async score (root, { scoresId }, { models }) {
              return models.Scores.findByPk(scoresId)
        },
        async allScores (root, args, { models }) {
              return models.Scores.findAll()
        }
    },
    
    Mutation: {
        async createScores (root, { scoresId, awayTeamId, homeTeamId, awayTeamScore,
                                   homeTeamScore, quarter, time, gameComplete }, { models }) {
            return models.Scores.create({
                scoresId,
                awayTeamId,
                homeTeamId,
                awayTeamScore,
                homeTeamScore,
                quarter,
                time,
                gameComplete
              })
        },
        async deleteScores(root, { scoresId }, { models }) {
            //const id = scoresId
            models.Scores.destroy({
                where: {
                    scoresId: scoresId
                }
            })

            return `Score with ID: ${scoresId} deleted`
        },
        async updateScores(root, { scoresId, awayTeamId, homeTeamId, awayTeamScore,
                                   homeTeamScore, quarter, time, gameComplete }, { models }) {
                models.Scores.update({ 
                    awayTeamId: awayTeamId,
                    homeTeamId: homeTeamId,
                    awayTeamScore: awayTeamScore,
                    homeTeamScore: homeTeamScore,
                    quarter: quarter,
                    time: time,
                    gameComplete: gameComplete
                },
                {
                    where: {
                        scoresId: scoresId
                    }
                }  
            )

            pubsub.publish("scoreUpdated", { scoresUpdated: { scoresId, awayTeamId, homeTeamId, awayTeamScore,
                                                             homeTeamScore, quarter, time, gameComplete } });
            return `Score with ID: ${scoresId} updated`
        }
    },

    Subscription: {
        scoresUpdated: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator(["scoreUpdated"]),
          },
    },
}

module.exports = resolvers

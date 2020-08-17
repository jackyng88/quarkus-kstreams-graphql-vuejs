const bcrypt = require('bcryptjs')


const resolvers = {
    Subscription: {
        
    },

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

            return models.Scores.findByPk(scoresId)
        }
    },
}

module.exports = resolvers

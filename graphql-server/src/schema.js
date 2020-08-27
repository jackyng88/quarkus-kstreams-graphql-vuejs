const { gql } = require('apollo-server')

const typeDefs = gql`
    type Scores {
        scoresId: String!
        awayTeamId: Int!
        homeTeamId: Int!
        awayTeamScore: Int!
        homeTeamScore: Int!
        quarter: Int!
        time: Int!
        gameComplete: Boolean!
      }

    type Query {
        score(scoresId: String!): Scores
        allScores: [Scores!]!
    }

    type Mutation {
        createScores(
          scoresId: String!
          awayTeamId: Int!
          homeTeamId: Int!
          awayTeamScore: Int!
          homeTeamScore: Int!
          quarter: Int!
          time: Int!
          gameComplete: Boolean!
          ): Scores!

        deleteScores(scoresId: String!): String

        updateScores(
          scoresId: String!
          awayTeamId: Int!
          homeTeamId: Int!
          awayTeamScore: Int!
          homeTeamScore: Int!
          quarter: Int!
          time: Int!
          gameComplete: Boolean!
          ): String
        
    }

    type Subscription {
        scoresUpdated: Scores
      }
`

module.exports = typeDefs
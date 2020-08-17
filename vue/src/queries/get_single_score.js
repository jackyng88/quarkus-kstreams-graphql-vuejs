import gql from 'graphql-tag'

export const GET_SINGLE_SCORE = gql`query {
    score(scoresId: String!): Scores!
    }`
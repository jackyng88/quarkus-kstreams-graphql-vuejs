import gql from 'graphql-tag'

export const GET_ALL_SCORES = gql`query {
      allScores {
        scoresId,
        awayTeamId,
        homeTeamId,
        awayTeamScore,
        homeTeamScore,
        quarter,
        time,
        gameComplete
      }
    }`
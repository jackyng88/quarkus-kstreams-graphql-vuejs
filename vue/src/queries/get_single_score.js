import gql from 'graphql-tag'

export const GET_SINGLE_SCORE = gql`query getScore($scoresId: String!) {
        score(scoresId: $scoresId) {
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
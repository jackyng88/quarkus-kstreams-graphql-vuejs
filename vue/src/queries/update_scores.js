import gql from 'graphql-tag'

export const UPDATE_SCORES = gql`mutation updateScores($scoresId: String!, $awayTeamId: Int! $homeTeamId: Int!, 
    $awayTeamScore: Int!, $homeTeamScore: Int!, $quarter: Int!, $time: Int! $gameComplete: Boolean!) {
        updateScores(scoresId: $scoresId, awayTeamId: $awayTeamId, homeTeamId: $homeTeamId, awayTeamScore: $awayTeamScore, 
        homeTeamScore: $homeTeamScore, quarter: $quarter, time: $time, gameComplete: $gameComplete) {
            scoresId,
            awayTeamId,
            homeTeamId,
            awayTeamScore,
            homeTeamScore,
            quarter,
            time,
            gameComplete
        }
    }
`
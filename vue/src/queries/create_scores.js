import gql from 'graphql-tag'

export const CREATE_SCORE = gql`mutation createScores($scoresId: String!, $awayTeamId: Int! $homeTeamId: Int!, 
    $awayTeamScore: Int!, $homeTeamScore: Int!, $quarter: Int!, $time: Int! $gameComplete: Boolean!) {
        createScores(scoresId: $scoresId, awayTeamId: $awayTeamId, homeTeamId: $homeTeamId, awayTeamScore: $awayTeamScore, 
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
}`
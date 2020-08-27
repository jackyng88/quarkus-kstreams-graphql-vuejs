import gql from 'graphql-tag'

export const SCORES_SUBSCRIPTION = gql`subscription onScoreUpdate($scoresId: String!) {
        scoresUpdated (scoresId: $scoresId) {
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
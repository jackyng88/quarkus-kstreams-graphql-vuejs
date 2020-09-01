import gql from 'graphql-tag'

export const SCORES_SUBSCRIPTION = gql`subscription onScoreUpdate {
        scoresUpdated  {
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
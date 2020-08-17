const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const graphql = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const cors = require('cors');

const app = express();
app.use(cors());

const database = new sqlite3.Database("./my.db");


const createScoresTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS scores (
        scoresId string PRIMARY KEY,
        awayTeamId integer,
        homeTeamId integer,
        awayTeamScore integer,
        homeTeamScore integer,
        quarter integer,
        time integer,
        gameComplete boolean)
        `;
    return database.run(query);
}
createScoresTable();

const ScoresType = new graphql.GraphQLObjectType({
    name: "Scores",
    fields: {
        scoresId: { type: graphql.GraphQLString },
        awayTeamId: { type: graphql.GraphQLInt },
        homeTeamId: { type: graphql.GraphQLInt },
        awayTeamScore: { type: graphql.GraphQLInt },
        homeTeamScore: { type: graphql.GraphQLInt }, 
        quarter: { type: graphql.GraphQLInt },
        time: { type: graphql.GraphQLInt },
        gameComplete: { type: graphql.GraphQLBoolean }
    }
});


var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        scores: {
            type: graphql.GraphQLList(ScoresType),
            resolve: (root, args, context, info) => {
                return new Promise((resolve, reject) => {

                    database.all("SELECT * FROM scores;", function (err, rows) {
                        if (err) {
                            reject([]);
                        }
                        resolve(rows);
                    });
                });

            }
        },
        score: {
            type: ScoresType,
            args: {
                scoresId: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve: (root, {
                scoresId
            }, context, info) => {
                return new Promise((resolve, reject) => {

                    database.all("SELECT * FROM scores WHERE scoresId = (?);", [scoresId], function (err, rows) {
                        if (err) {
                            reject(null);
                        }
                        resolve(rows[0]);
                    });
                });
            }
        }
    }
});


var mutationType = new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createScores: {
            type: ScoresType,
            args: {
                scoresId: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                awayTeamId: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                homeTeamId: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                awayTeamScore: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                homeTeamScore: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                quarter: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                time: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                gameComplete: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean)
                }
            },
            resolve: (root, {
                scoresId,
                awayTeamId,
                homeTeamId,
                awayTeamScore,
                homeTeamScore,
                quarter,
                time,
                gameComplete
            }) => {
                return new Promise((resolve, reject) => {
                    database.run('INSERT INTO scores (scoresId, awayTeamId, homeTeamId, awayTeamScore, homeTeamScore, \
                                            quarter, time, gameComplete) VALUES (?,?,?,?,?,?,?,?);', [scoresId, awayTeamId, homeTeamId, awayTeamScore, homeTeamScore,
                                                quarter, time, gameComplete ], (err) => {
                        if (err) {
                            reject(null);
                        }
                        database.get("SELECT last_insert_rowid() as scoresId", (err, row) => {

                            resolve({
                                scoresId: row["scoresId"],
                                awayTeamId: awayTeamId,
                                homeTeamId: homeTeamId,
                                awayTeamScore: awayTeamScore,
                                homeTeamScore: homeTeamScore,
                                quarter: quarter,
                                time: time,
                                gameComplet: gameComplete
                            });
                        });
                    });
                })

            }
        },
        updateScores: {
            type: graphql.GraphQLString,
            args: {
                scoresId: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                awayTeamId: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                homeTeamId: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                awayTeamScore: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                homeTeamScore: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                quarter: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                time: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
                },
                gameComplete: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean)
                }
            },
            resolve: (root, {
                scoresId,
                awayTeamId,
                homeTeamId,
                awayTeamScore,
                homeTeamScore,
                quarter,
                time,
                gameComplete
            }) => {
                return new Promise((resolve, reject) => {
                    database.run('UPDATE scores SET awayTeamId = (?), homeTeamId = (?), awayTeamScore = (?), \
                                  homeTeamScore = (?), quarter = (?), time = (?), gameComplete = (?) WHERE ScoresId = (?);', 
                                  [awayTeamId, homeTeamId, awayTeamScore, homeTeamScore, quarter, time, 
                                   gameComplete, scoresId], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(`Score #${scoresId} updated`);

                    });
                })
            }
        },
        deleteScores: {
            type: graphql.GraphQLString,
            args: {
                scoresId: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve: (root, {
                scoresId
            }) => {
                return new Promise((resolve, reject) => {
                    database.run('DELETE from scores WHERE scoresId =(?);', [scoresId], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(`Score #${scoresId} deleted`);

                    });
                })

            }
        }
    }
});

const schema = new graphql.GraphQLSchema({
    query: queryType,
    mutation: mutationType
});

app.use("/graphql", graphqlHTTP({ schema: schema, graphiql: true}));
app.listen(4000, () => {
    console.log("GraphQL server running at http://localhost:4000.");
});
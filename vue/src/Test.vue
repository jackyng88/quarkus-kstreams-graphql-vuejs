<template>
  <div id="test">
    <h2>Vue.js Kafka Streams GraphQL Test</h2>

    <table border="1" width="100%" style="border-collapse: collapse;">
      <tr>
        <th>scoresId</th>
        <th>awayTeamId</th>
        <th>homeTeamId</th>
        <th>awayTeamScore</th>
        <th>homeTeamScore</th>
        <th>quarter</th>
        <th>time</th>
        <th>gameComplete</th>
      </tr>

      <tr v-bind:key="score.scoresId" v-for="score in allScores">
        <td>{{ score.scoresId }}</td>
        <td>{{ score.awayTeamId }}</td>
        <td>{{ score.homeTeamId }}</td>
        <td>{{ score.awayTeamScore }}</td>
        <td>{{ score.homeTeamScore }}</td>
        <td>{{ score.quarter }}</td>
        <td>{{ score.time }}</td>
        <td>{{ score.gameComplete }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import Socket from "./socket";
import { CREATE_SCORE } from "./queries/create_scores";
import { UPDATE_SCORES } from "./queries/update_scores";
import { GET_ALL_SCORES } from "./queries/all_scores";
import { GET_SINGLE_SCORE } from "./queries/get_single_score";
import { SCORES_SUBSCRIPTION } from "./queries/updated_scores_subscription";

export default {
  name: "Test",
  data: function () {
    return {
      messages: [],
      connection: null,
      index: 0,
      scores: {},
      scoresId: "",
      awayTeamId: "",
      homeTeamId: "",
      awayTeamScore: "",
      homeTeamScore: "",
      quarter: "",
      time: "",
      gameComplete: false,
      allScores: {},
    };
  },
  apollo: {
    allScores: {
      query: GET_ALL_SCORES,
      subscribeToMore: {
        document: SCORES_SUBSCRIPTION,
        variables() {
          return {
            scoresId: this.scoresId,
          };
        },
        update(data) {
          return data.allScores;
        },
        updateQuery: (previousData, { subscriptionData }) => {
          const updatedScoreIndex = previousData.allScores.findIndex(
            (scores) =>
              scores.scoresId === subscriptionData.data.scoresUpdated.scoresId
          );

          const updatedScore = subscriptionData.data.scoresUpdated;
          const newAllScores = [...previousData.allScores];
          newAllScores[updatedScoreIndex] = updatedScore;
          const result = {
            ...previousData,
            allScores: newAllScores,
          };

          return result;
        },
      },
    },
  },
  methods: {
    async handleMessage(msg) {
      this.messages.push(msg);
      let idx = this.messages[this.messages.length - 1]["scoreId"];
      console.log("index is ", idx);
      const temp = await this.checkScores(idx);
      console.log(temp.data.score);

      if (temp.data.score === null) {
        this.createScores(msg);
        location.reload();
      } 
      else {
        this.updateScores(msg);
      }
    },
    async checkScores(scoreId) {
      let score = this.$apollo.query({
        query: GET_SINGLE_SCORE,
        variables: {
          scoresId: scoreId,
        },
      });

      console.log("Checking score " + scoreId);

      return score;
    },

    updateScores(msg) {
      console.log(`Update score: # ${msg["scoreId"]}`);
      this.$apollo.mutate({
        mutation: UPDATE_SCORES,
        variables: {
          scoresId: msg["scoreId"],
          awayTeamId: msg["awayTeamId"],
          homeTeamId: msg["homeTeamId"],
          awayTeamScore: msg["awayTeamScore"],
          homeTeamScore: msg["homeTeamScore"],
          quarter: msg["quarter"],
          time: msg["time"],
          gameComplete: msg["gameComplete"],
        },
      });
    },
    createScores(msg) {
      console.log("Create score:", msg["scoreId"]);
      this.$apollo.mutate({
        mutation: CREATE_SCORE,
        variables: {
          scoresId: msg["scoreId"],
          awayTeamId: msg["awayTeamId"],
          homeTeamId: msg["homeTeamId"],
          awayTeamScore: msg["awayTeamScore"],
          homeTeamScore: msg["homeTeamScore"],
          quarter: msg["quarter"],
          time: msg["time"],
          gameComplete: msg["gameComplete"],
        },
      });
    },
  },
  created() {
    Socket.$on("message", this.handleMessage);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleMessage);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
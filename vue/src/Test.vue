<template>
  <div id="test">
    <h2>Vue.js WebSocket Test</h2>
    <!-- <button v-on:click="sendMessage('hello')">Send Message</button> -->

    <!-- <li v-for="message in messages" :key="message.id">{{ message }}</li> -->
    <!-- <ul id="messages">
      <li v-for="message in messages" class="message" :key="message.id">
        {{ message }}
      </li>
    </ul>-->

    <!-- <li>{{ messages }}</li> -->

    <!-- <li v-for="score in allScores" :key="score.scoresId">{{ score }}</li> -->
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
//import gql from 'graphql-tag'
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
    // allScores: GET_ALL_SCORES,
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
          // This function returns our QUERY into the data property "items" when the component is loaded.
          return data.allScores;
        },
        updateQuery: (previousData, { subscriptionData }) => {
          // return {
          //   allScores: [...previousData.allScores, subscriptionData.data.scoresUpdated],
          // };

          const updatedScoreIndex = previousData.allScores.findIndex(
            (scores) =>
              scores.scoresId === subscriptionData.data.scoresUpdated.scoresId
          );

          const updatedScore = subscriptionData.data.scoresUpdated;
          //const newAllScores = previousData.allScores.slice();
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
      //console.log(temp)
      //let stuff = temp.then(res => { stuff = res })
      //console.log(temp.then(res => { stuff = res }))
      console.log(temp.data.score);
      if (temp.data.score === null) {
        //this.scores[idx]++;
        //this.updateScores(msg);
        this.createScores(msg);
      } else {
        //this.scores[idx] = 1;
        //this.createScores(msg);
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
      //let stuff = await this.promiseValue(score)
      // let stuff = score.then((res) => {
      //     res.data.score
      // })

      // let stuff = await score.then((res) => {
      //     return res.data.score
      // })

      // return score.then((res) => {
      //     res.data.score
      // })
      return score;
      //console.log(stuff)
      //return stuff;
      //return this.$apollo.queries.singleScore
    },
    // promiseValue(score) {
    //     //return score.then(res => { return res.data.score})
    //     return
    // },
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
    // checkScore(scoresId) {
    //     // check if this record exists already in the database.
    // }
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
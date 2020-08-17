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

    <li>{{ messages }}</li>
  </div>
</template>

<script>
import Socket from "./socket";
//import gql from 'graphql-tag'
import { CREATE_SCORE } from './queries/create_scores'
import { UPDATE_SCORES } from './queries/update_scores'
import { GET_ALL_SCORES } from './queries/all_scores'
//import { GET_SINGLE_SCORE} from './queries/get_single_score'

export default {
  name: "Test",
  data: function () {
    return {
      messages: [],
      connection: null,
      index: 0,
      scores: { },
      scoresId: '',
      awayTeamId: '',
      homeTeamId: '',
      awayTeamScore: '',
      homeTeamScore: '',
      quarter: '',
      time: '',
      gameComplete: false
    };
  },
  apollo: {
    allScores: GET_ALL_SCORES,
  },
  methods: {
    handleMessage(msg) {
        this.messages.push(msg);
        let idx = this.messages[this.messages.length - 1]["scoreId"];
        console.log("index is ", idx)

        if (this.scores[idx]) {
            this.scores[idx]++;
            this.updateScores(msg);
        }
        else {
            this.scores[idx] = 1;
            this.createScores(msg);
        }

        // if (this.checkScores(idx)) {
        //     //this.scores[idx]++;
        //     this.updateScores(msg);
        // }
        // else {
        //     //this.scores[idx] = 1;
        //     this.createScores(msg);
        // }

    },
    // checkScores(scoreId) {
    //     const score = this.$apollo.query({
    //         query: GET_SINGLE_SCORE,
    //         variables: {
    //             scoresId: scoreId
    //         }
    //     })

    //     return (score)
    // },
    updateScores(msg) {
        console.log(`Update score: # ${msg["scoreId"]}`)
        this.$apollo.mutate({
            
          mutation: UPDATE_SCORES,
          variables:{
            scoresId: msg["scoreId"],
            awayTeamId: msg["awayTeamId"],
            homeTeamId: msg["homeTeamId"],
            awayTeamScore: msg["awayTeamScore"],
            homeTeamScore: msg["homeTeamScore"],
            quarter: msg["quarter"],
            time: msg["time"],
            gameComplete: msg["gameComplete"],
          }
        }
      )
    },
    createScores(msg) {
        console.log("Create score:", msg["scoreId"])
        this.$apollo.mutate({
          mutation: CREATE_SCORE,
          variables:{
            scoresId: msg["scoreId"],
            awayTeamId: msg["awayTeamId"],
            homeTeamId: msg["homeTeamId"],
            awayTeamScore: msg["awayTeamScore"],
            homeTeamScore: msg["homeTeamScore"],
            quarter: msg["quarter"],
            time: msg["time"],
            gameComplete: msg["gameComplete"],
          },
        }
      )
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
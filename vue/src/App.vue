<template>
  <div id="app">
      <table border='1' width='100%' style='border-collapse: collapse;'>
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
    
       <tr v-bind:key="score.scoresId" v-for='score in allScores'>
         <td>{{ score.scoresId }}</td>
         <td>{{ score.awayTeamId }}</td>
         <td>{{ score.homeTeamId }}</td>
         <td>{{ score.awayTeamScore }}</td>
         <td>{{ score.homeTeamScore }}</td>
         <td>{{ score.quarter }}</td>
         <td>{{ score.time }}</td>
         <td>{{ score.gameComplete }}</td>
         <td>
          <input type="button" @click="selectScore(score)" value="Select">
          <input type="button" @click="deleteScore(score.scoresId)" value="Delete">
         </td> 
       </tr>
     </table>
     <br>
        <form>
          <label>scoresId</label>
          <input type="text" name="scoresId" v-model="scoresId">
          <br>
    
          <label>awayTeamId</label>
          <input type="number" name="awayTeamId" v-model.number="awayTeamId">
          <br>
    
          <label>homeTeamId</label>
          <input type="number" name="homeTeamId" v-model.number="homeTeamId">
          <br>

          <label>awayTeamScore</label>
          <input type="number" name="awayTeamScore" v-model.number="awayTeamScore">
          <br>

          <label>homeTeamScore</label>
          <input type="number" name="homeTeamScore" v-model.number="homeTeamScore">
          <br>

          <label>quarter</label>
          <input type="number" name="quarter" v-model.number="quarter">
          <br>

          <label>time</label>
          <input type="number" name="time" v-model.number="time">
          <br>

          <label>gameComplete</label>
          <input type="checkbox" name="gameComplete" v-model="gameComplete">
          <br>
          
          <input v-if="scoresId" type="button" @click="createScores(scoresId, awayTeamId, homeTeamId, awayTeamScore,
                                                               homeTeamScore, quarter, time, gameComplete)" value="Add">
          
          <input v-if="scoresId" type="button" @click="updateScores(scoresId, awayTeamId, homeTeamId, awayTeamScore, 
                                                            homeTeamScore, quarter, time, gameComplete)" value="Update">
          <input type="button" @click="clearForm()" value="Clear">
          
        </form>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { CREATE_SCORE } from './queries/create_scores'
import { UPDATE_SCORES } from './queries/update_scores'
import { GET_ALL_SCORES } from './queries/all_scores'

export default {
  name: 'App',
  data() {
    return {
      scoresId: '',
      awayTeamId: '',
      homeTeamId: '',
      awayTeamScore: '',
      homeTeamScore: '',
      quarter: '',
      time: '',
      gameComplete: false
    }
  },
  apollo: {
    allScores: GET_ALL_SCORES,
  },
  methods: {
    createScores(scoresId, awayTeamId, homeTeamId, awayTeamScore, homeTeamScore, quarter, time, gameComplete) {
      console.log("Create score:", scoresId)
      this.$apollo.mutate({
          mutation: CREATE_SCORE,
          variables:{
            scoresId: scoresId,
            awayTeamId: awayTeamId,
            homeTeamId: homeTeamId,
            awayTeamScore: awayTeamScore,
            homeTeamScore: homeTeamScore,
            quarter: quarter,
            time: time,
            gameComplete: gameComplete,
          },
        }
      )
      location.reload();
    },
    updateScores(scoresId, awayTeamId, homeTeamId, awayTeamScore, homeTeamScore, quarter, 
                time, gameComplete){
      console.log(`Update score: # ${scoresId}`)
      this.$apollo.mutate({
          mutation: UPDATE_SCORES,
          variables:{
            scoresId: scoresId,
            awayTeamId: awayTeamId,
            homeTeamId: homeTeamId,
            awayTeamScore: awayTeamScore,
            homeTeamScore: homeTeamScore,
            quarter: quarter,
            time: time,
            gameComplete: gameComplete,
          }
        }
      )
      location.reload();
    },
    deleteScore(scoresId){
      console.log(`Delete score: # ${scoresId}`)
      this.$apollo.mutate({
          mutation: gql`mutation deleteScores($scoresId: String!){
            deleteScores(scoresId: $scoresId)
          }`,
          variables:{
            scoresId: scoresId,
          }
        }
      )
      location.reload();
    },
    selectScore(score){
      this.scoresId = score.scoresId;
      this.awayTeamId = score.awayTeamId;
      this.homeTeamId = score.homeTeamId;
      this.awayTeamScore = score.awayTeamScore;
      this.homeTeamScore = score.homeTeamScore;
      this.quarter = score.quarter;
      this.time = score.time;
      this.gameComplete = score.gameComplete;
    },
    clearForm(){
      this.ScoresId = '';
      this.awayTeamId = '';
      this.homeTeamId = '';
      this.awayTeamScore = '';
      this.homeTeamScore = '';
      this.quarter = '';
      this.time = '';
      this.gameComplete = false;
    }
  },
  components: {
   
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  number-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

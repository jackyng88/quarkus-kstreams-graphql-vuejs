// import Vue from 'vue'
// //import App from './App.vue'
// import ApolloClient from "apollo-boost"
// import VueApollo from "vue-apollo"
// import { WebSocketLink } from "apollo-link-ws";

// import Test from './Test.vue'
    

// // const wsLink = new WebSocketLink({
// //   uri: `ws://localhost:5000/`,
// //   options: {
// //     reconnect: true
// //   }
// // });

// const apolloClient = new ApolloClient({
//   //uri: "http://localhost:4000/graphql"
//   uri: "http://localhost:4000/"
// })

// Vue.use(VueApollo)

// const apolloProvider = new VueApollo({
//   defaultClient: apolloClient,
// })

// Vue.config.productionTip = false

// new Vue({
//   //render: h => h(App),
//   render: h => h(Test),
//   apolloProvider
// }).$mount('#app')

import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
//import App from './App.vue'
import Test from './Test.vue'

Vue.config.productionTip = false

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql'
})

const wsLink = new WebSocketLink({
    //uri: 'ws://192.168.0.6:5000/websocket/',
    //uri: 'ws://localhost:5000/websocket/',
    //uri: 'ws://192.168.0.6:5000/',
    uri: 'ws://localhost:4000/graphql',
    options: {
      reconnect: true,
      lazy: true
    }
})

wsLink.subscriptionClient.on('connecting', () => {
  console.log('connecting');
});

wsLink.subscriptionClient.on('connected', () => {
  console.log('connected');
});

wsLink.subscriptionClient.on('reconnecting', () => {
  console.log('reconnecting');
});

wsLink.subscriptionClient.on('reconnected', () => {
  console.log('reconnected');
});

wsLink.subscriptionClient.on('disconnected', () => {
  console.log('disconnected');
});

wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () =>
  wsLink.subscriptionClient.maxConnectTimeGenerator.max;

const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
)



const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true
})

const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})

Vue.use(VueApollo)

new Vue({
    apolloProvider,
    render: h => h(Test)
}).$mount('#app')
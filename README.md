# quarkus-kafka-graphql-vuejs-app project

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

## In-depth Writeup

For a general and elaborate walkthrough visit the readme [here](https://github.com/jackyng88/quarkus-streams-graphql-scenario/blob/master/index.mdx)

## Prereqs

- Maven

- Node/NPM

- Java

- Access to Kafka Topics

## Starting the GraphQL API Server

- Change directory into the `graphql-server` folder.

- Run the server

```shell
node src/index.js
```

- You can perform queries directly on the GraphQL API at `localhost:4000`

## Start VueJS

- Vue along with Vue-Apollo is used for the frontend portions as well as utilizing Apollo Client for connections with a GraphQL APi Server.

- Change directories into the `vue` folder from the root directory.

- Start the server

```shell
npm run serve
```

- View at `localhost:8080`

## Exporting Environment Variables for our Quarkus Application

- The Quarkus application will need access to the following environment variables.

```shell
export BOOTSTRAP_SERVERS=your-bootstrap-server-address:443 \
export START_TOPIC_NAME=name-of-topic-to-consume-from \
export ONGOING_TOPIC_NAME=name-of-topic-to-produce-to \
export COMPLETE_TOPIC_NAME=name-of-topic-for-complete-games \
export CERT_LOCATION=/path-to-pkcs12-cert/es-cert.p12 \
export CERT_PASSWORD=certificate-password \
export SCRAM_USERNAME=your-scram-username \
export SCRAM_PASSWORD=your-scram-password \
```

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:
```
./mvnw quarkus:dev
```

## Packaging and running the application

The application can be packaged using `./mvnw package`.
It produces the `quarkus-kafka-vuejs-app-1.0-SNAPSHOT-runner.jar` file in the `/target` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/lib` directory.

The application is now runnable using `java -jar target/quarkus-kafka-vuejs-app-1.0-SNAPSHOT-runner.jar`.

## Creating a native executable

You can create a native executable using: `./mvnw package -Pnative`.

Or, if you don't have GraalVM installed, you can run the native executable build in a container using: `./mvnw package -Pnative -Dquarkus.native.container-build=true`.

You can then execute your native executable with: `./target/quarkus-kafka-vuejs-app-1.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult https://quarkus.io/guides/building-native-image.

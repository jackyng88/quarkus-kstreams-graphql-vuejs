package com.ibm.garage.cpat.domain;

import java.io.IOException;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Produced;

import io.quarkus.kafka.client.serialization.JsonbSerde;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibm.garage.cpat.infrastructure.*;


@ApplicationScoped
public class BasketballTopology {

    // The topology will have a KStream for the constantly updating game score, it will then 
    // do a join by teamId on a KTable and enrich the message with the teamNames. It will then
    // output this to a topic.
    @ConfigProperty(name = "START_TOPIC_NAME")
    private String INCOMING_TOPIC;

    @ConfigProperty(name = "ONGOING_TOPIC_NAME")
    private String ONGOING_TOPIC;

    @ConfigProperty(name = "COMPLETE_TOPIC_NAME")
    private String COMPLETE_TOPIC;

    @Inject
    OngoingWebSocketServer ongoingEndPoint;


    @Produces
    public Topology buildTopology() {

        StreamsBuilder builder = new StreamsBuilder();

        JsonbSerde<Scores> scoresSerde = new JsonbSerde<>(Scores.class);

        ObjectMapper obj = new ObjectMapper();

        KStream<String, Scores> ongoingScoresStream = builder.stream(
            INCOMING_TOPIC,
            Consumed.with(Serdes.String(), scoresSerde)
        );
        
        KStream<String, Scores>[] branches = ongoingScoresStream.branch(
            (key, scores) -> scores.gameComplete,
            (key, scores) -> !scores.gameComplete
        );

        branches[0].to(
            COMPLETE_TOPIC,
            Produced.with(Serdes.String(), scoresSerde)
        );

        branches[1].peek((key, scores) -> {
            ongoingEndPoint.getSessions().forEach(s -> {
                try {
                    s.getBasicRemote().sendText(obj.writeValueAsString(scores));
                }
                catch (IOException e) {
                    throw new RuntimeException(e);
                }
            });
        });

        branches[1].to(
            ONGOING_TOPIC,
            Produced.with(Serdes.String(), scoresSerde)
        );

        return builder.build();
    }
}
package com.ibm.garage.cpat.infrastructure;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import javax.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.reactive.messaging.Outgoing;

import io.reactivex.Flowable;
import io.smallrye.reactive.messaging.kafka.KafkaRecord;

import com.ibm.garage.cpat.domain.*;


@ApplicationScoped
public class Producer {
    
    // Start a game between an away team and an home team. Starts at 1st quarter, and 12 minutes (720 seconds) for time.
    // This producer will constantly decrement the time/update the score. When the time reaches 00:00 the quarter
    // will increment. When the game reaches the 4th quarter and 00:00, the game is completed.

    Scores mockScore = new Scores("14", 1, 2, 0, 0, 1, 720, false);
    private Random random = new Random();


    @Outgoing("mock-messages")
    public Flowable<KafkaRecord<String, Scores>> produceMock() {
        return Flowable.interval(5, TimeUnit.SECONDS)
                       .map(tick -> {
                            return runGame(mockScore);
                        });
    }

    public KafkaRecord<String, Scores> runGame(Scores mock) {

        // Start a new game if the previous one finished.
        if (mock.gameComplete) {
            mock = startNewGame(mock);
        }

        // Ongoing game score calculation
        if (mock.quarter < 5 && mock.time > 0) {
            mock.time -= 20;
            mock.awayTeamScore = calculateScore(mock.awayTeamScore);
            mock.homeTeamScore = calculateScore(mock.homeTeamScore);

            // End of quarters 1, 2 and 3.
            if (mock.quarter < 4 && mock.time == 0) {
                mock.quarter += 1;
                mock.time = 720;
            }
        }

        // Game is finished
        else if (mock.quarter == 4 && mock.time == 0) {
            mock.gameComplete = true;
        }

        return KafkaRecord.of(mock.scoreId, mock);
    }

    public int calculateScore (int score) {

        // randomly choose between a two pointer or a three pointer.
        // Then calculate with a percentage. 0 for two pointer, 1 for three.
        // Two is 45% and three is 32%. 
        int points = 0;
        int shotSelection = random.nextInt(2);
        float shotPercentage = random.nextFloat();

        if (shotSelection == 0) {
            if (shotPercentage <= 0.45) {
                points = 2;
            }
        }

        else if (shotSelection == 1) {
            if (shotPercentage <= 0.32) {
                points = 3;
            }
        }

        return score + points;
    }

    public Scores startNewGame(Scores mock) {
        String newScoreId = String.valueOf(Integer.parseInt(mock.scoreId) + 1);
        int newAwayTeamId = mock.awayTeamId + 2;
        int newHomeTeamId = mock.homeTeamId + 2;

        Scores newMockScore = new Scores (newScoreId, newAwayTeamId, newHomeTeamId, 0, 0, 1, 720, false);
        
        return newMockScore;
    }
}
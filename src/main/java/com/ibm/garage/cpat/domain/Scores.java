package com.ibm.garage.cpat.domain;

public class Scores {

    public String scoreId;
    public int awayTeamId;
    public int homeTeamId;
    public int awayTeamScore;
    public int homeTeamScore;
    public int quarter;
    public int time;
    public boolean gameComplete;

    public Scores() {

    }

    public Scores(String scoreId, int awayTeamId, int homeTeamId, int awayTeamScore, 
                  int homeTeamScore, int quarter, int time, boolean gameComplete) {

        this.scoreId = scoreId;
        this.awayTeamId = awayTeamId;
        this.homeTeamId = homeTeamId;
        this.awayTeamScore = awayTeamScore;
        this.homeTeamScore = homeTeamScore;
        this.quarter = quarter;
        this.time = time;
        this.gameComplete = gameComplete;
    }
}
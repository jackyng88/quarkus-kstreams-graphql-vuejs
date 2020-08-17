package com.ibm.garage.cpat.domain;

public class FinalScore {
    
    private int finalScoreId;
    private int scoreId;
    private int awayTeamId;
    private String awayTeamName;
    private int homeTeamId;
    private String homeTeamname;
    private int finalScore;

    public FinalScore() {

    }

    public FinalScore(int finalScoreId, int scoreId, int awayTeamId, String awayTeamName, int homeTeamid,
                      String homeTeamName, int finalScore) {

        this.finalScoreId = finalScoreId;
        this.scoreId = scoreId;
        this.awayTeamId = awayTeamId;
        this.awayTeamName = awayTeamName;
        this.homeTeamId = homeTeamid;
        this.homeTeamname = homeTeamName;
        this.finalScore = finalScore;
    }
}
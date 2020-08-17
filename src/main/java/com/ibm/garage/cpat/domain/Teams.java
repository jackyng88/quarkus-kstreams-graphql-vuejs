package com.ibm.garage.cpat.domain;


// Teams model to be loaded into a KTable for checking/enrichment.
public class Teams {

    private int teamId;
    private String teamCity;
    private String teamName;

    private Teams() {

    }

    private Teams(int teamId, String teamCity, String teamName) {
        this.teamId = teamId;
        this.teamCity = teamCity;
        this.teamName = teamName;
    }
}
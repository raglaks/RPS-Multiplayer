var config = {
    apiKey: "AIzaSyDdbCzSttyyrPSblcRWczN1ph-PL9wJSH4",
    authDomain: "rps-multiplayer-33a99.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-33a99.firebaseio.com",
    projectId: "rps-multiplayer-33a99",
    storageBucket: "rps-multiplayer-33a99.appspot.com",
    messagingSenderId: "362020719621"
};

//initialize firebase
firebase.initializeApp(config);

//create ref to entire database
var database = firebase.database();

//create ref to what i need
var refObj = firebase.database().ref();
//variable for connections child
var connectionsRef = database.ref("/connections");
//variable to access connected default method
var connectedRef = database.ref(".info/connected");
//variable to create names child to store player names
var names = database.ref("/names");
//var for p1
var p1 = database.ref("/p1");
//var for p2
var p2 = database.ref("/p2");
//empty array created for players' name and stored as strings
var nameStrings = [];

var name = " ";

var wins = 0;
var losses = 0;
var ties = 0;

var soloWins = database.ref("/soloWins");
var soloLosses = database.ref("/soloLosses");
var soloTies = database.ref("/soloTies");

var comp = " ";

var sW = 0;
var sL = 0;
var sT = 0;

var player1 = database.ref("/player1");

//functions to be done on doc ready status
$(document).ready(function () {

    //methods to remove and clean database children upon doc ready status
    names.remove();
    database.ref("/player1").remove();
    database.ref("/computer").remove();
    database.ref("/p1").remove();
    database.ref("/p2").remove();

    soloLosses.remove();
    soloTies.remove();
    soloWins.remove();

    //function to check how many online
    //only runs when someone is online and removes child when disconnected
    //the boolean values are pushed to the connectionsRef var that was created in line 24
    connectedRef.on("value", function (snapshot) {
        if (snapshot.val()) {
            var con = connectionsRef.push(true);
            con.onDisconnect().remove();
        }
    });

    //function is called on value and then is filled with numChildren to get a numerial value
    //conditions are then set for what type of game the user can play
    //player vs player can only be played if there are two users online
    connectionsRef.on("value", function (snapshot) {

        var players = snapshot.numChildren();

        if (players === 2) {
            $("#players").html("<h2>Your opponent is waiting, challenge them.</h2>");
            $("#pvp").on("click", function () {
                pvpName();
            });
        } else if (players === 1) {
            $("#players").html("<h2>No opponents found; try playing against the computer.</h2>");
        } else if (players > 2) {
            $("#players").html("<h2>There are " + players + " online players. Please wait till a game finishes.</h2>");
        }

    });

    //function to get player name
    function pvpName() {
        $("#sub").html("<h2>What is your name?</h2>");

        $("#content").text(" ");
        $("#players").text(" ");

        var form = $("<form>");
        var input = $("<input>");
        var button = $("<button>");

        input.attr("type", "text");
        input.attr("class", "form-control text-center");
        input.attr("id", "name");

        button.attr("type", "button");
        button.attr("class", "btn btn-danger text-center");
        button.attr("id", "submit");
        button.text("Submit");

        form.append(input);
        form.append(button);

        $("#content").append(form);

        pvpFire();
    }

    //function to then take that string and push it to firebase, specifically to the names child created above
    function pvpFire() {
        $("#submit").on("click", function (event) {
            name = $("#name").val();

            names.push(name);

            names.on("child_added", function (snapshot) {
                var push = snapshot.val();
                nameStrings.push(push);
            });

            $("#sub").text(" ");
            $("#content").text(" ");
            $("#players").html("<h2>" + name + ", choose rock, paper or scissors.</h2>")
            pvpGame();
        });
    }

    //function to start game
    function pvpGame() {
        console.log(nameStrings);

        refObj.on("child_added", function (snapshot) {
            if (nameStrings.length === 1) {
                p1.child("name").set(nameStrings[0]);
            } else if (nameStrings.length === 2) {
                p2.child("name").set(nameStrings[1]);
                p1.child("name").set(nameStrings[0]);
            }
        });

        $("#sub").html("<h2>Click on any image to play:</h2>");

        var img1 = $("<img>");
        var img2 = $("<img>");
        var img3 = $("<img>");

        img1.attr("src", "assets/images/rock1.png");
        img1.attr("id", "rock");

        img2.attr("src", "assets/images/paper1.png");
        img2.attr("id", "paper");

        img3.attr("src", "assets/images/scissors1.png");
        img3.attr("id", "scissors");

        $("#content").append(img1);
        $("#content").append(img2);
        $("#content").append(img3);

        $("#rock").on("click", function () {

            refObj.on("value", function (snapshot) {

                var p1name = snapshot.val().p1.name;
                var p2name = snapshot.val().p2.name;

                if (p1name === name) {

                    p1.update({
                        choice: "rock"
                    });

                } else if (p2name === name) {
                    p2.update({
                        choice: "rock"
                    });
                }

            });

            evalFirebase();
        });

        $("#paper").on("click", function () {

            refObj.on("value", function (snapshot) {

                var p1name = snapshot.val().p1.name;
                var p2name = snapshot.val().p2.name;

                if (p1name === name) {

                    p1.update({
                        choice: "paper"
                    });

                } else if (p2name === name) {
                    p2.update({
                        choice: "paper"
                    });
                }

            });

            evalFirebase();

        });

        $("#scissors").on("click", function () {

            refObj.on("value", function (snapshot) {

                var p1name = snapshot.val().p1.name;
                var p2name = snapshot.val().p2.name;

                if (p1name === name) {

                    p1.update({
                        choice: "scissors"
                    });

                } else if (p2name === name) {
                    p2.update({
                        choice: "scissors"
                    });
                }
            });

            evalFirebase();

        });

    }


    function evalFirebase() {
        refObj.on("value", function (snapshot) {

            var p1choice = snapshot.val().p1.choice;
            var p2choice = snapshot.val().p2.choice;

            var p1name = snapshot.val().p1.name;
            var p2name = snapshot.val().p2.name;

            if (p1choice === p2choice) {

                p1.update({
                    result: "tie",
                    ties: ties + 1
                });

                p2.update({
                    result: "tie",
                    ties: ties + 1
                });

                console.log("it's a tie");
                $("#sub").html("<h2>It's a tie!</h2>");
                $("#content").html("<h2 class='text-warning'>You both chose " + p1choice + ".</h2>");
                $("#players").text(" ");

            } else if (p1choice === "rock" && p2choice === "scissors") {

                p1.update({
                    result: "win",
                    wins: wins + 1
                });

                p2.update({
                    result: "loss",
                    losses: losses + 1
                });

                console.log(p1name + " wins, " + p2name + " loses.");
                $("#sub").html("<h2>" + p1name + " wins, " + p2name + " loses.</h2>");
                $("#content").html("<h2>" + p1name + " chose " + p1choice + ", " + p2name + " chose " + p2choice + ".</h2>");
                $("#players").text(" ");

            } else if (p1choice === "scissors" && p2choice === "paper") {

                p1.update({
                    result: "win",
                    wins: wins + 1
                });

                p2.update({
                    result: "loss",
                    losses: losses + 1
                });

                console.log(p1name + " wins, " + p2name + " loses.");
                $("#sub").html("<h2>" + p1name + " wins, " + p2name + " loses.</h2>");
                $("#content").html("<h2>" + p1name + " chose " + p1choice + ", " + p2name + " chose " + p2choice + ".</h2>");
                $("#players").text(" ");

            } else if (p1choice === "paper" && p2choice === "rock") {

                p1.update({
                    result: "win",
                    wins: wins + 1
                });

                p2.update({
                    result: "loss",
                    losses: losses + 1
                });

                console.log(p1name + " wins, " + p2name + " loses.");
                $("#sub").html("<h2>" + p1name + " wins, " + p2name + " loses.</h2>");
                $("#content").html("<h2>" + p1name + " chose " + p1choice + ", " + p2name + " chose " + p2choice + ".</h2>");
                $("#players").text(" ");

            } else if (p2choice === "rock" && p1choice === "scissors") {

                p1.update({
                    result: "loss",
                    losses: losses + 1
                });

                p2.update({
                    result: "win",
                    wins: wins + 1
                });

                console.log(p2name + " wins, " + p1name + " loses.");
                $("#sub").html("<h2>" + p2name + " wins, " + p1name + " loses.</h2>");
                $("#content").html("<h2>" + p2name + " chose " + p2choice + ", " + p1name + " chose " + p1choice + ".</h2>");
                $("#players").text(" ");

            } else if (p2choice === "scissors" && p1choice === "paper") {

                p1.update({
                    result: "loss",
                    losses: losses + 1
                });

                p2.update({
                    result: "win",
                    wins: wins + 1
                });

                console.log(p2name + " wins, " + p1name + " loses.");
                $("#sub").html("<h2>" + p2name + " wins, " + p1name + " loses.</h2>");
                $("#content").html("<h2>" + p2name + " chose " + p2choice + ", " + p1name + " chose " + p1choice + ".</h2>");
                $("#players").text(" ");

            } else if (p2choice === "paper" && p1choice === "rock") {

                p1.update({
                    result: "loss",
                    losses: losses + 1
                });

                p2.update({
                    result: "win",
                    wins: wins + 1
                });

                console.log(p2name + " wins, " + p1name + " loses.");
                $("#sub").html("<h2>" + p2name + " wins, " + p1name + " loses.</h2>");
                $("#content").html("<h2>" + p2name + " chose " + p2choice + ", " + p1name + " chose " + p1choice + ".</h2>");
                $("#players").text(" ");

            }

        });
    }

    //these functions are called when no other active players are online; but you can still play against the computer
    $("#pvpc").on("click", function () {
        playerName();
        $("#players").text(" ");

        // $("#score").text(" ");
    });

    function playerName() {
        $("#sub").html("<h2>What is your name?</h2>");

        $("#content").text(" ");

        var form = $("<form>");
        var input = $("<input>");
        var button = $("<button>");

        input.attr("type", "text");
        input.attr("class", "form-control text-center");
        input.attr("id", "name");

        button.attr("type", "button");
        button.attr("class", "btn btn-danger text-center");
        button.attr("id", "submit");
        button.text("Submit");

        form.append(input);
        form.append(button);

        $("#content").append(form);

        nameToFire();
        
    };

    function nameToFire() {
        $("#submit").on("click", function () {
            var submit = $("#name").val();

            refObj.set({
                player1: submit,
            });

            soloLosses.set({
                losses: sL
            });
    
            soloWins.set({
                wins: sW
            });
    
            soloTies.set({
                ties: sT
            });

            $("#sub").text(" ");
            $("#content").text(" ");

            gamePage();
        });
    };

    function gamePage() {

        $("#players").text(" ");

        $("#sub").html("<h2>Click on any image to play:</h2>");

        var img1 = $("<img>");
        var img2 = $("<img>");
        var img3 = $("<img>");

        img1.attr("src", "assets/images/rock1.png");
        img1.attr("id", "rock");

        img2.attr("src", "assets/images/paper1.png");
        img2.attr("id", "paper");

        img3.attr("src", "assets/images/scissors1.png");
        img3.attr("id", "scissors");

        $("#content").append(img1);
        $("#content").append(img2);
        $("#content").append(img3);

        // $("#score").html("<h2>Wins: " + sW + " Losses: " + sL + " Ties: " + sT + "</h2>");

        computerPlay();

            refObj.on("value", function (snapshot) {

                comp = snapshot.val().computer;

            });

        $("#rock").on("click", function () {

                if (comp === "paper") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-danger'>YOU LOSE</h2>");
                    $("#players").html("<button type='button' class='btn btn-danger' id='again'>Play again</button>");
                    

                    lossesAdd();

                } else if (comp === "rock") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-warning'>TIE</h2>");
                    $("#players").html("<button type='button' class='btn btn-danger' id='again'>Play again</button>");

                    tiesAdd();

                } else if (comp === "scissors") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-success'>YOU WIN!</h2>");
                    $("#players").html("<button type='button' class='btn btn-danger' id='again'>Play again</button>");

                    winsAdd();

                }

                $("#again").on("click", function () {
                    $("#content").text(" ");
                    $("#score").text(" ");
                    gamePage();
                });

        });

        $("#paper").on("click", function () {

                if (comp === "paper") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-warning'>TIE</h2>");
                    $("#players").html("<button type='button' class='btn btn-danger' id='again'>Play again</button>");

                    tiesAdd();

                } else if (comp === "scissors") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-danger'>YOU LOSE</h2>");
                    $("#players").html("<button type='button' class='btn btn-danger' id='again'>Play again</button>");

                    lossesAdd();

                } else if (comp === "rock") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-success'>YOU WIN!</h2>");
                    $("#players").html("<button type='button' class='btn btn-danger' id='again'>Play again</button>");

                    winsAdd();

                }

                $("#again").on("click", function () {
                    $("#content").text(" ");
                    $("#score").text(" ");
                    gamePage();
                });

        });

        $("#scissors").on("click", function () {

                if (comp === "paper") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-success'>YOU WIN!</h2>");
                    $("#players").html("<button type='button' class='btn btn-danger' id='again'>Play again</button>");

                    winsAdd();

                } else if (comp === "scissors") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-warning'>TIE</h2>");
                    $("#players").html("<button type='button' class='btn btn-danger' id='again'>Play again</button>");

                    tiesAdd();

                } else if (comp === "rock") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-danger'>YOU LOSE</h2>");
                    $("#players").html("<button type='button' class='btn btn-danger' id='again'>Play again</button>");

                    lossesAdd();

                }

                $("#again").on("click", function () {
                    $("#content").text(" ");
                    $("#score").text(" ");
                    gamePage();
                });
        });

        function winsAdd() {

            sW = sW + 1;
        
            soloWins.update({
                wins: sW
            });

            $("#score").html("<h2>Wins: " + sW + " Losses: " + sL + " Ties: " + sT + "</h2>");

        }

        function lossesAdd() {

            sL = sL + 1;
            
            soloLosses.update({
                losses: sL
            });

            $("#score").html("<h2>Wins: " + sW + " Losses: " + sL + " Ties: " + sT + "</h2>");

        }

        function tiesAdd() {

            sT = sT + 1;

            soloTies.update({
                ties: sT
            });

            $("#score").html("<h2>Wins: " + sW + " Losses: " + sL + " Ties: " + sT + "</h2>");

        }

    };

    function computerPlay() {
        var options = ["rock", "paper", "scissors"];

        var rando = Math.floor(Math.random() * options.length);

        refObj.update({
            computer: options[rando],
        });
    }

});


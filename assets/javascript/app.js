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

//functions to be done on doc ready status
$(document).ready(function () {

    //methods to remove and clean database children upon doc ready status
    names.remove();
    database.ref("/player1").remove();
    database.ref("/computer").remove();
    database.ref("/p1").remove();
    database.ref("/p2").remove();

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

    })

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
            var submit = $("#name").val();

            names.push(submit);

            names.on("child_added", function (snapshot) {
                var push = snapshot.val();
                nameStrings.push(push);
            });

            $("#sub").text(" ");
            $("#content").text(" ");
            $("#players").html("<h2>" + submit + ", choose rock, paper or scissors.</h2>")
            pvpGame();
        });
    }

    //function to start game
    function pvpGame() {
        console.log(nameStrings);

        refObj.on("child_added", function(snapshot) {
            if (nameStrings.length === 1) {
                p1.child("name").set(nameStrings[0]);
            } else if (nameStrings.length === 2) {
                p2.child("name").set(nameStrings[1]);
                p1.child("name").set(nameStrings[0]);
            }
        })

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

        });

        $("#paper").on("click", function () {

        });

        $("#scissors").on("click", function () {

        });
    }

    //these functions are called when no other active players are online; but you can still play against the computer
    $("#pvpc").on("click", function () {
        playerName();
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

            $("#sub").text(" ");
            $("#content").text(" ");

            gamePage();
        });
    };

    function gamePage() {

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
            computerPlay();

            refObj.on("value", function (snapshot) {
                console.log(snapshot.val());

                var comp = snapshot.val().computer;
                console.log(comp);

                if (comp === "paper") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-danger'>YOU LOSE</h2>");
                } else if (comp === "rock") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-warning'>TIE</h2>");
                } else {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-success'>YOU WIN!</h2>");
                }
            });
        });

        $("#paper").on("click", function () {
            computerPlay();

            refObj.on("value", function (snapshot) {
                console.log(snapshot.val());

                var comp = snapshot.val().computer;
                console.log(comp);

                if (comp === "paper") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-warning'>TIE</h2>");

                } else if (comp === "scissors") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-danger'>YOU LOSE</h2>");
                } else {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-success'>YOU WIN!</h2>");
                }
            });
        });

        $("#scissors").on("click", function () {
            computerPlay();

            refObj.on("value", function (snapshot) {
                console.log(snapshot.val());

                var comp = snapshot.val().computer;
                console.log(comp);

                if (comp === "paper") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-success'>YOU WIN!</h2>");

                } else if (comp === "scissors") {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-warning'>TIE</h2>");
                } else {
                    $("#content").html("<h2 class='text-white'>Computer chose " + comp + "</h2>");
                    $("#sub").html("<h2 class='text-danger'>YOU LOSE</h2>");
                }
            });
        });
    };

    function computerPlay() {
        var options = ["rock", "paper", "scissors"];

        var rando = Math.floor(Math.random() * options.length);

        console.log(options[rando]);

        refObj.update({
            computer: options[rando],
        });
    }

    // refObj.on("value", function(snapshot) {
    //     console.log(snapshot.val());
    // });
});


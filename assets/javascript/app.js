var config = {
    apiKey: "AIzaSyDdbCzSttyyrPSblcRWczN1ph-PL9wJSH4",
    authDomain: "rps-multiplayer-33a99.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-33a99.firebaseio.com",
    projectId: "rps-multiplayer-33a99",
    storageBucket: "rps-multiplayer-33a99.appspot.com",
    messagingSenderId: "362020719621"
};
firebase.initializeApp(config);

var database = firebase.database();

var refObj = firebase.database().ref();



$(document).ready(function () {

    var connectionsRef = database.ref("/connections");
    var connectedRef = database.ref(".info/connected");
    var names = database.ref("/names");
    names.remove();

    connectedRef.on("value", function (snapshot) {
        if (snapshot.val()) {
            var con = connectionsRef.push(true);
            con.onDisconnect().remove();
        }
    });

    connectionsRef.on("value", function (snapshot) {

        var players = snapshot.numChildren();
        console.log(players);

        if (players === 2) {
            $("#players").html("<h2>Your opponent is waiting, challenge them.</h2>");
            console.log(snapshot.val());
            $("#pvp").on("click", function () {
                pvpName();
            });
        } else if (players === 1) {
            $("#players").html("<h2>No opponents found; try playing against the computer.</h2>");
        } else if (players > 2) {
            $("#players").html("<h2>There are " + players + " online players. Please wait till a game finishes.</h2>");
        }

    })

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

    function pvpFire() {
        $("#submit").on("click", function () {
            var submit = $("#name").val();

            names.push(submit);

            $("#sub").text(" ");
            $("#content").text(" ");

            pvpGame();
        });
    }

    function pvpGame() {
        names.on("value", function (snapshot) {
            console.log(snapshot.val());
        });
    }

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
});


var config = {
    apiKey: "AIzaSyDdbCzSttyyrPSblcRWczN1ph-PL9wJSH4",
    authDomain: "rps-multiplayer-33a99.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-33a99.firebaseio.com",
    projectId: "rps-multiplayer-33a99",
    storageBucket: "rps-multiplayer-33a99.appspot.com",
    messagingSenderId: "362020719621"
};
firebase.initializeApp(config);

//var database = firebase.database();

var refObj = firebase.database().ref();

$(document).ready(function () {

    refObj.on("value", function (snapshot) {
        console.log(snapshot.val());
    });

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

    }

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
    }

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
    }
});


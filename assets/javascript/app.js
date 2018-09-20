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
        $("#sub").text(" ");
        $("#content").text(" ");
        var form = $("<form>");
        var input = $("<input>");
        var button = $("<button>");
        var h2 = $("<h2>");

        input.attr("type", "text");
        input.attr("class", "form-control text-center");
        input.attr("id", "name");

        button.attr("type", "button");
        button.attr("class", "btn btn-danger text-center");
        button.attr("id", "submit");
        button.text("Submit");

        form.append(input);
        form.append(button);

        h2.text("What is your name?");

        $("#sub").append(h2);
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
        var h2
    }
});


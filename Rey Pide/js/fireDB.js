
$(document).ready(function () {

    $('#submitScore').click(function () {

        var firebaseConfig = {
            apiKey: "AIzaSyASx6Bc2UUdoS2OIJX-T8gyoXI56l-oZHM",
            authDomain: "gcw-online.firebaseapp.com",
            projectId: "gcw-online",
            storageBucket: "gcw-online.appspot.com",
            messagingSenderId: "655276489505",
            appId: "1:655276489505:web:8912ee2130f1d9302c9c60",
            databaseURL: 'https://gcw-online-default-rtdb.firebaseio.com/'
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        var puntuacion = Number($('#highscore').text());
        var nombre = $('#playerHighScore').val();

        var dbRefPlayers = firebase.database().ref().child("puntuaciones");

        var newScore = dbRefPlayers.push();
        newScore.set({
            nombre,
            puntuacion
        });

        $(this).hide();
    });

});
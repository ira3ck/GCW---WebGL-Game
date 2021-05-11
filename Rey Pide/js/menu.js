$(document).ready(function () {

    var count = 1;
    var clase;

    function addScoreScreen(nombre, puntuacion, img) {

        switch (count) {
            case 1:
                clase = 'onePlace';
                break;
            case 2:
                clase = 'twoPlace';
                break;
            case 3:
                clase = 'threePlace';
                break;
            default:
                clase = 'nPlace';
                break;
        }
        $('#scoreScreen').append('<tr class="' + clase + '"><td>#' + count + '</td><td class="pfp"><img src="https://pbs.twimg.com/media/EiNYZHXWsAE1525?format=png&name=360x360"alt="error"></td><td>' + nombre + '</td><td class="pts">' + puntuacion + '</td></tr>')
        count++;
    };

    $('#rankBTN').click(function () {

        var array = new Array();

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

        var dbRefPlayers = firebase.database().ref().child("puntuaciones").orderByChild('puntuacion');

        dbRefPlayers.once("value", function (snapshot) {
            snapshot.forEach(function (child) {

                var nombre = child.child('nombre').val();
                var puntuacion = child.child('puntuacion').val();
                var img = 0;

                let punt = {
                    "nombre": nombre,
                    "puntuacion": puntuacion,
                    "img": img
                }
                array.push(punt);

            });

            var reverse = array.reverse();

            reverse.forEach(punt => {
                addScoreScreen(punt['nombre'], punt['puntuacion'], punt['img']);
            });
        });

    });

});
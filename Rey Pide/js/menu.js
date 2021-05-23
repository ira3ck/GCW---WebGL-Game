
var user = null;
var fotos = ['cuboVela.png', 'mono.png', 'nota.png', 'pollo.png'];
var fotoPos = 1;

function session() {
    $('#inSesCard').hide();
    $('#sessionCard').show();
    $('#sessionCard').children('.pfName').text(user);
    $('.perfil').attr('data-target', '#accountModal');
    $('#sessionCard img').attr('src', 'img/profile/' + fotos[fotoPos]);
    $('#usernameInputM').val(user);
}

function register(userP, passP, imgP) {
    var dataToSend = {
        action: 'regis',
        user: userP,
        pass: passP,
        img: imgP
    };
    $.ajax({
        url: "webservice/webservice.php",
        async: true,
        type: "POST",
        data: dataToSend,
        dataType: "json",
        success: function (data) {
            data.forEach(element => {
                if (element.error == 1) {
                    $('#volverBTN').click();
                    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                }
                else {
                    alert('La cuenta no pudo ser registrada, intenta otro nombre de usuario');
                }
            });
        },
        error: function (x, y, z) {
            alert("Error del WebService: " + x + y + z);
        }
    });
}

function initSes(userP, passP) {
    var dataToSend = {
        action: 'inSes',
        user: userP,
        pass: passP
    };
    $.ajax({
        url: "webservice/webservice.php",
        async: true,
        type: "POST",
        data: dataToSend,
        dataType: "json",
        success: function (data) {
            if (data === undefined || data.length == 0) {
                alert('Error de inicio de sesión.');
            }
            data.forEach(element => {
                alert('Sesión iniciada con éxito');
                guardar(element.usuario, element.imagen);
                $('#inSesRegModal').children('.Close').click();
                session();
            });
        },
        error: function (x, y, z) {
            alert("Error del WebService: " + x + y + z);
        }
    });
}

function guardar(nombre, imagen) {
    localStorage.setItem("usN", nombre);
    localStorage.setItem("imagen", imagen);
    sessionStorage.setItem("usN", nombre);
    sessionStorage.setItem("imagen", imagen);
    leerLocal();
}

function leerLocal() {
    //user = String(localStorage.getItem("usN"));
    //fotoPos = String(localStorage.getItem("imagen"));
    user = sessionStorage.getItem("usN");
    fotoPos = sessionStorage.getItem("imagen");
}

function clSes() {
    sessionStorage.clear();
    $('#inSesCard').show();
    $('#sessionCard').hide();
    $('#sessionCard').children('.pfName').text(user);
    $('.perfil').attr('data-target', '#inSesRegModal')
    $('#accountModal').children('.Close').click();
}

function defineLimits(arr, index) {
    var topeAlto = arr.length;
    if (index == topeAlto) {
        index = 0;
    } else if (index < 0) {
        index = topeAlto - 1;
    }
    return index;
}

$(document).ready(function () {

    var count = 1;
    var clase;

    $('#sessionCard').hide();

    $('#regis').hide();
    $('#volverBTN').hide();

    leerLocal();
    if (user != null) {
        session();
    }

    $('#regisBTN').click(function () {
        $('#inSes').hide();
        $('#regis').show();
        $('#volverBTN').show();
    });

    $('#volverBTN').click(function () {
        $('#regis').hide();
        $('#inSes').show();
        $('#volverBTN').hide();
    });

    $('#closeSes').click(function () {
        clSes();
    });

    $('#inSesBTN').click(function () {
        var user = String($('#usernameInput').val());
        var pass = String($('#passwordInput').val());
        initSes(user, pass);
    });

    $('#modificar').click(function () {
        guardar(user, fotoPos);
        leerLocal();
        session();
    });

    $('#registrarme').click(function () {
        var user = String($('#usernameInputR').val());
        var pass = String($('#passwordInputR').val());
        var pass2 = String($('#passwordInput2R').val());

        if (pass == pass2) {
            register(user, pass, '1');
        }
        else {
            alert('Las contraseñas no coinciden');
        }
    });

    $('.photoChoose > img').attr('src', 'img/profile/' + fotos[fotoPos]);

    $('#izqArrow').click(function () {
        fotoPos--;
        fotoPos = defineLimits(fotos, fotoPos);
        $('.photoChoose > img').attr('src', 'img/profile/' + fotos[fotoPos]);
    });

    $('#derArrow').click(function () {
        fotoPos++;
        fotoPos = defineLimits(fotos, fotoPos);
        $('.photoChoose > img').attr('src', 'img/profile/' + fotos[fotoPos]);
    });

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
        $('#scoreScreen').append('<tr class="' + clase + '"><td>#' + count + '</td><td class="pfp"><img src="img/profile/' + fotos[img] +' " alt="error"></td><td>' + nombre + '</td><td class="pts">' + puntuacion + '</td></tr>')
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
                var img = child.child('img').val();
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
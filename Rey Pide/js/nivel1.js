import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';


class Pickable {
    constructor(objeto, reco, seguirA, entregado, activado) {
        this.Objeto = objeto;
        this.Recogido = reco;
        this.Seguir = seguirA;
        this.Entregado = entregado;
        this.Activado = activado;
        this.Origen = 0
        this.movido = false
    }

}

class Player {
    constructor(Score, Battery, Nitro) {
        this.Bateria = Battery;
        this.Puntaje = Score;
        this.Turbo = Nitro;
        this.Aturdido = false;
        this.StunnedTime = 0;
    }
}

class RndPosition {
    constructor(equis, zeta) {
        this.Px = equis
        this.Pz = zeta
        this.tomada = false
    }
}

var scene;
var camera;
var renderer;
var controls;
var objects = [];
var clock;
var deltaTime;
var keys = {};
var cube, cube2, testobj, pick2, pick3, pick4, pick5;
var camMove;
var facing1Prev;
var angle;

var PickArray = [];
var Posiciones = []
var Players = [];
var meta;

var reloj = 60;
var countDown = 10;

var puntuacion = 400, puntuacion2 = 300;


$(document).ready(function () {

    $('#pauseMenu').hide();

    $('#volver').click(function () {
        $('#pauseMenu').hide();
    })

    setupScene();
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    render();
});

function onKeyDown(event) {
    keys[String.fromCharCode(event.keyCode)] = true;
}
function onKeyUp(event) {
    keys[String.fromCharCode(event.keyCode)] = false;
}

window.addEventListener('resize', onWindowResize);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

$(document).on('keydown', function (e) {
    //if (e.key == "Enter") $('.save').click();
    if (e.key == "Escape") {
        $('#pauseMenu').toggle();
    }
});

function render() {
    PickArray[0].Objeto = testobj;
    PickArray[1].Objeto = pick2;
    PickArray[2].Objeto = pick3;
    PickArray[3].Objeto = pick4;
    PickArray[4].Objeto = pick5;
    requestAnimationFrame(render);

    for (var i = 0; i < 5; i++) {
        PickArray[i].Objeto.visible = false;
        if (PickArray[i].movido == false) {
            PickArray[i].Objeto.position.x = Posiciones[PickArray[i].Origen].Px
            PickArray[i].Objeto.position.z = Posiciones[PickArray[i].Origen].Pz
        }
    }

    $("#x").text(Players[0].Bateria);
    deltaTime = clock.getDelta();

    if (contador(deltaTime) && $('#pauseMenu').is(':hidden') && elTiempo(deltaTime)) {

        $('.cargando').hide();

        var moveF1 = false;
        var moveS1 = false;
        var yaw = 0;
        var forward = 0;
        ////CARGA
        if (Players[0].Bateria < 100) {
            if ((cube.position.z > -10 && cube.position.z < -5) && (cube.position.x > -5 && cube.position.x < 5)) {
                Players[0].Bateria += .1;
            }
        }

        if (Players[1].Bateria < 100) {
            if ((cube2.position.z > -10 && cube2.position.z < -5) && (cube2.position.x > -5 && cube2.position.x < 5)) {
                Players[1].Bateria += .1;
            }
        }
        ////DESCARGADOS
        if (Players[0].Bateria < 0) {
            cube.position.z = -8;
            cube.position.x = 0;
            Players[0].Descargado = true;
            Players[0].Turbo = false;
        }
        if (Players[0].Bateria > 30)
            Players[0].Descargado = false;

        if (Players[1].Bateria < 0) {
            cube2.position.z = -8;
            cube2.position.x = 0;
            Players[1].Descargado = true;
            Players[1].Turbo = false;
        }
        if (Players[1].Bateria > 30)
            Players[1].Descargado = false;

        for (var i = 0; i < 5; i++) {
            if (PickArray[i].Activado) {
                PickArray[i].Objeto.visible = true
                if (PickArray[i].Recogido == true && PickArray[i].Entregado == false) {
                    if (PickArray[i].Seguir == cube) {
                        if (cube.rotation.y == (90 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x + 2;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z;
                        }
                        if (cube.rotation.y == (270 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x - 2;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z;
                        }
                        if (cube.rotation.y == (0 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z + 2;
                        }
                        if (cube.rotation.y == (180 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z - 2;
                        }

                        if (cube.rotation.y == (45 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x + 1;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z + 1;
                        }
                        if (cube.rotation.y == (315 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x - 1;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z + 1;
                        }
                        if (cube.rotation.y == (135 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x + 1;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z - 1;
                        }
                        if (cube.rotation.y == (225 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x - 1;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z - 1;
                        }
                    }
                    if (PickArray[i].Seguir == cube2) {
                        if (cube2.rotation.y == (90 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x + 2;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z;
                        }
                        if (cube2.rotation.y == (270 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x - 2;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z;
                        }
                        if (cube2.rotation.y == (0 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z + 2;
                        }
                        if (cube2.rotation.y == (180 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z - 2;
                        }

                        if (cube2.rotation.y == (45 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x + 1;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z + 1;
                        }
                        if (cube2.rotation.y == (315 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x - 1;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z + 1;
                        }
                        if (cube2.rotation.y == (135 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x + 1;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z - 1;
                        }
                        if (cube2.rotation.y == (225 * Math.PI) / 180) {
                            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x - 1;
                            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z - 1;
                        }
                    }
                }
                if (PickArray[i].Entregado == false) {

                    if (PickArray[i].Objeto.position.distanceTo(meta) < 3.0) {
                        //PickArray[0].Objeto.remove();
                        PickArray[i].Objeto.position.y = -5;
                        if (PickArray[i].Seguir == cube)
                            Players[0].Puntaje += 1;
                        else
                            Players[1].Puntaje += 1

                        if (i < 4)
                            PickArray[i + 1].Activado = true;
                        else
                            PickArray[4].Activado = true;

                        PickArray[i].Entregado = true;
                        PickArray[i].Activado = false;

                        //PickArray[0].Objeto.remove();
                    }

                }
            }

        }
        if (keys["E"]) {
            for (var i = 0; i < 5; i++) {
                var distance = Math.sqrt(((PickArray[i].Objeto.position.x - cube.position.x) ** 2) + ((PickArray[i].Objeto.position.z - cube.position.z) ** 2));
                if (distance < 1.6 && PickArray[i].Recogido == false) {
                    PickArray[i].Seguir = cube;
                    PickArray[i].Recogido = true;
                    PickArray[i].movido = true;

                    P1WO = true;
                }
            }
        }
        else if (keys["Q"]) {
            for (var i = 0; i < 5; i++) {
                if (PickArray[i].Recogido == true && PickArray[i].Seguir == cube) {

                    PickArray[i].Recogido = false
                    P1WO = false;
                }
            }
        }
        if (keys["O"]) {
            for (var i = 0; i < 5; i++) {
                var distance = Math.sqrt(((PickArray[i].Objeto.position.x - cube2.position.x) ** 2) + ((PickArray[i].Objeto.position.z - cube2.position.z) ** 2));
                if (distance < 1.6 && PickArray[i].Recogido == false) {
                    PickArray[i].Seguir = cube2;
                    PickArray[i].Recogido = true;
                    PickArray[i].movido = true;

                    P1WO = true;
                }
            }
        }
        else if (keys["U"]) {
            for (var i = 0; i < 5; i++) {
                if (PickArray[i].Recogido == true && PickArray[i].Seguir == cube2) {
                    PickArray[i].Seguir = PickArray[i].Objeto;
                    PickArray[i].Recogido = false
                    P1WO = false;
                }
            }
        }

        /////////////////
        ////TURBO
        if (keys["R"] && Players[0].Descargado == false) {
            Players[0].Turbo = !Players[0].Turbo;
        }
        if (keys["P"] && Players[1].Descargado == false) {
            Players[1].Turbo = !Players[1].Turbo;
        }

        /////////////////
        ////GOLPE

        if (keys["F"]) {

            var distance = Math.sqrt(((cube.position.x - cube2.position.x) ** 2) + ((cube.position.z - cube2.position.z) ** 2));
            if (distance < 2 && Players[1].Aturdido == false) {
                Players[0].Bateria -= 10;
                Players[1].Aturdido = true;
                for (var i = 0; i < 5; i++) {
                    if (PickArray[i].Recogido == true && PickArray[i].Seguir == cube2) {
                        PickArray[i].Seguir = PickArray[i].Objeto;
                        PickArray[i].Recogido = false
                        P1WO = false;
                    }
                }

            }

        }

        if (keys["H"]) {
            var distance = Math.sqrt(((cube.position.x - cube2.position.x) ** 2) + ((cube.position.z - cube2.position.z) ** 2));
            if (distance < 2 && Players[0].Aturdido == false) {
                Players[1].Bateria -= 10;
                Players[0].Aturdido = true;
                for (var i = 0; i < 5; i++) {
                    if (PickArray[i].Recogido == true && PickArray[i].Seguir == cube) {
                        PickArray[i].Seguir = PickArray[i].Objeto;
                        PickArray[i].Recogido = false
                        P1WO = false;
                    }
                }

            }
        }

        for (var i = 0; i < 2; i++) {
            Players[i].StunnedTime += .2;
            if (Players[i].Aturdido == true && Players[i].StunnedTime > 9) {
                Players[i].Aturdido = false;
                Players[i].StunnedTime = 0;
            }
        }
        /////////////////

        if (Players[0].Bateria > 0 && Players[0].Descargado == false && Players[0].Aturdido == false) {

            if (keys["A"]) {
                cube.rotation.y = (90 * Math.PI) / 180;
                Players[0].Bateria -= .05;
                yaw = 5;
                moveS1 = true;
            } else if (keys["D"]) {
                cube.rotation.y = (270 * Math.PI) / 180;
                Players[0].Bateria -= .05;
                yaw = -5;
                moveS1 = true;
            }
            if (keys["W"]) {
                cube.rotation.y = (0 * Math.PI) / 180;
                Players[0].Bateria -= .05;
                if (keys["A"])
                    cube.rotation.y = (45 * Math.PI) / 180;
                else if (keys["D"])
                    cube.rotation.y = (315 * Math.PI) / 180;
                forward = -5;
                moveF1 = true;
            } else if (keys["S"]) {
                cube.rotation.y = (180 * Math.PI) / 180;
                Players[0].Bateria -= .05;
                if (keys["A"])
                    cube.rotation.y = (135 * Math.PI) / 180;
                else if (keys["D"])
                    cube.rotation.y = (225 * Math.PI) / 180;
                forward = 5;
                moveF1 = true;
            }

            if (Players[0].Turbo) {
                yaw = yaw * 2;
                forward = forward * 2;
                Players[0].Bateria -= .05;
            }

        }

        var yaw2 = 0;
        var forward2 = 0;
        var moveF2 = false;
        var moveS2 = false;
        if (Players[1].Bateria > 0 && Players[1].Descargado == false) {
            if (keys["J"]) {
                cube2.rotation.y = (90 * Math.PI) / 180;
                Players[1].Bateria -= 0.05;
                yaw2 = 5;
                moveS2 = true;
            } else if (keys["L"]) {
                cube2.rotation.y = (270 * Math.PI) / 180;
                Players[1].Bateria -= 0.05;
                yaw2 = -5;
                moveS2 = true;
            }
            if (keys["I"]) {
                cube2.rotation.y = (0 * Math.PI) / 180;
                Players[1].Bateria -= 0.05;
                if (keys["J"])
                    cube2.rotation.y = (45 * Math.PI) / 180;
                else if (keys["L"])
                    cube2.rotation.y = (315 * Math.PI) / 180;
                forward2 = -5;
                moveF2 = true;
            } else if (keys["K"]) {
                cube2.rotation.y = (180 * Math.PI) / 180;
                Players[1].Bateria -= 0.05;
                if (keys["J"])
                    cube2.rotation.y = (135 * Math.PI) / 180;
                else if (keys["L"])
                    cube2.rotation.y = (225 * Math.PI) / 180;
                forward2 = 5;
                moveF2 = true;

            }

            //Rotación de los objetos
            for (var i = 0; i < PickArray.length; i++) {
                if (PickArray[i].Recogido == false)
                    PickArray[i].Objeto.rotateY(THREE.Math.degToRad(15) * deltaTime);
            }

            var orientation = cube.position.x * facing1Prev.z - cube.position.z * facing1Prev.x;
            if (orientation > 0) angle = 2 * Math.PI - angle;
            cube.position.z += -forward * deltaTime;
            if (moveS1)
                cube.position.x += yaw * deltaTime;

            if (moveF2)
                cube2.position.z += -forward2 * deltaTime;
            if (moveS2)
                cube2.position.x += yaw2 * deltaTime;

            camMove.position.x = (cube.position.x + cube2.position.x) / 20;
            camMove.position.z = (cube.position.z + cube2.position.z) / 20;

            camera.lookAt(camMove.position);
            camera.position.set(0, 15, camMove.position.z - 10);

            updateHUD(Players);
            highscore(puntuacion, puntuacion2);

            renderer.render(scene, camera);

            facing1Prev.copy(cube.position);

        }
    }

}//FIN RENDER


    function loadFBX(manager, path, onLoadCallback) {

        var loader = new FBXLoader(manager);
        loader.load(path, (object) => {

            object.traverse(function (child) {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }

            });
            onLoadCallback(object);

        });
    }

    //////////////////////////////////
    ////Funciones que sirven mucho////
    //////////////////////////////////

    function elTiempo(deltatime) {
        reloj -= 1 * deltatime;
        if (Math.floor(reloj) < 0) {
            reloj = 0;
            $('#gameOver').show();
            return false;
        }
        $('.tiempo').text(Math.floor(reloj));
        return true;
    }

    function updateHUD(players) {
        $("#x").text(players[0].Bateria);

        $("#lifeP1").css('width', players[0].Bateria + '%')

        $("#y").text(players[1].Bateria);

        $("#lifeP2").css('width', 'calc(' + players[1].Bateria + '% - 40px)')

        $("#z").text("ScoreP1:" + players[0].Puntaje + " ScoreP2:" + players[1].Puntaje);
    }

    function contador(deltatime) {
        countDown -= 1 * deltatime;
        if (Math.floor(countDown) < 0) {
            countDown = 0;
            return true;
        }
        return false;
    }

    function highscore(one, two) {
        if (one > two)
            $('#highscore').text(one);
        else
            $('#highscore').text(two);
    }

    //////////////////////////////////
    //////////////////////////////////
    //////////////////////////////////


    function setupScene() {

        meta = new THREE.Vector3();

        const path = "textures/level1/";
        const format = '.png';
        const urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];

        const textureCube = new THREE.CubeTextureLoader().load(urls);

        Players.push(new Player(0, 100, false));
        Players.push(new Player(0, 100, false));
        var visibleSize = { width: window.innerWidth, height: window.innerHeight };
        clock = new THREE.Clock();
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, visibleSize.width / visibleSize.height, 0.1, 100);

        scene.background = textureCube;

        camMove = new THREE.Object3D();
        camMove.position.set(0, 0, 0);
        scene.add(camMove);

        renderer = new THREE.WebGLRenderer({ precision: "mediump" });
        renderer.setClearColor(new THREE.Color(0, 0, 0));
        renderer.setPixelRatio(visibleSize.width / visibleSize.height);
        renderer.setSize(visibleSize.width, visibleSize.height);
        renderer.shadowMap.enabled = true;

        var ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 3);
        scene.add(ambientLight);

        const manager = new THREE.LoadingManager();

        THREE.DefaultLoadingManager.onStart = function () {
            console.log('Se empezó a cargar');
        }

        THREE.DefaultLoadingManager.onLoad = function () {
            console.log('Loading Complete!');
        };

        THREE.DefaultLoadingManager.onProgress = function () {
            console.log('Progreso');

        };

        THREE.DefaultLoadingManager.onError = function () {
            console.log('ERROR');
        };


        loadFBX(manager, "modelos/bot/fbx/bot.fbx", (object) => {
            cube = object;
            cube.position.x = 5;
            cube.position.y = 0.5;
            cube.scale.set(0.2, 0.2, 0.2);
            cube.castShadow = true;
            cube.receiveShadow = true;
            scene.add(cube);
        });

        loadFBX(manager, "modelos/bot/fbx2/bot.fbx", (object) => {
            cube2 = object;
            cube2.position.x = -5;
            cube2.position.y = 0.5;
            cube2.scale.set(0.2, 0.2, 0.2);
            cube2.castShadow = true;
            cube2.receiveShadow = true;
            scene.add(cube2);
        });

        loadFBX(manager, "modelos/stage1/objetos1/llanta/llanta.fbx", (object) => {
            testobj = object;
            testobj.position.set(0, 0, 0);
            testobj.scale.set(0.6, 0.6, 0.6);
            testobj.castShadow = true;
            testobj.receiveShadow = true;
            scene.add(testobj);
        });

        loadFBX(manager, "modelos/stage1/fbx/stage1N.fbx", (object) => {
            object.rotateY(THREE.Math.degToRad(180));
            object.castShadow = true;
            object.receiveShadow = true;
            scene.add(object);
        });

        loadFBX(manager, "modelos/king/fbx/king.fbx", (object) => {
            object.rotateY(THREE.Math.degToRad(180));
            object.position.z = 13;
            object.scale.set(0.5, 0.5, 0.5);
            meta.copy(object.position);
            object.castShadow = true;
            object.receiveShadow = true;
            scene.add(object);
        });
        //////RECOGIBLES
        loadFBX(manager, "modelos/stage1/objetos1/basura/basura.fbx", (object) => {
            pick2 = object;
            pick2.position.set(7, 0, 0);
            pick2.scale.set(0.01, 0.01, 0.01);
            pick2.castShadow = true;
            pick2.receiveShadow = true;
            scene.add(pick2);
        });
        loadFBX(manager, "modelos/stage1/objetos1/botella/coca.fbx", (object) => {
            pick3 = object;
            pick3.position.set(3, 0, 0);
            pick3.castShadow = true;
            pick3.receiveShadow = true;
            scene.add(pick3);
        });
        loadFBX(manager, "modelos/stage1/objetos1/hotDog/fbxHotDog.fbx", (object) => {
            pick4 = object;
            pick4.position.set(-3, 0, 0);
            pick4.scale.set(0.3, 0.3, 0.3);
            pick4.castShadow = true;
            pick4.receiveShadow = true;
            scene.add(pick4);
        });
        loadFBX(manager, "modelos/stage1/objetos1/lata/Perrybox.fbx", (object) => {
            pick5 = object;
            pick5.position.set(-7, 0, 0);
            pick5.scale.set(0.05, 0.05, 0.05);
            pick5.castShadow = true;
            pick5.receiveShadow = true;
            scene.add(pick5);
        });

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(3, 15, 20);
        light.castShadow = true; // default false
        scene.add(light);

        //Set up shadow properties for the light
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 500; // default

        Posiciones.push(new RndPosition(0, 0))
        Posiciones.push(new RndPosition(7, 0))
        Posiciones.push(new RndPosition(4, 0))
        Posiciones.push(new RndPosition(-4, 0))
        Posiciones.push(new RndPosition(-7, 0))


        //Pickables.push(testobj);
        PickArray.push(new Pickable(testobj, false, testobj, false, true));
        PickArray.push(new Pickable(pick2, false, pick2, false, false));
        PickArray.push(new Pickable(pick3, false, pick3, false, false));
        PickArray.push(new Pickable(pick4, false, pick4, false, false));
        PickArray.push(new Pickable(pick5, false, pick5, false, false));

        for (var i = 0; i < 5; i++) {

            var k = 0
            do {
                k = Math.floor(Math.random() * Posiciones.length);
            } while (Posiciones[k].tomada == true)
            PickArray[i].Origen = k
            Posiciones[k].tomada = true

        }

        facing1Prev = new THREE.Vector3(0, 0, 1);

        $("#scene-section").append(renderer.domElement);
    }
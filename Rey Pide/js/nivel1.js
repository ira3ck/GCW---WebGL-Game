import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';

class Pickable {
    constructor(objeto, reco, seguirA, entregado) {
        this.Objeto = objeto;
        this.Recogido = reco;
        this.Seguir = seguirA;
        this.Entregado = entregado;
    }

}

class Player {
    constructor(Score, Battery, Nitro) {
        this.Bateria = Battery;
        this.Puntaje = Score;
        this.Turbo = Nitro;
        this.Aturdido = false;
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
var facing1Prev, facing2Prev;
var posT;
var xAxis, zAxis;
var PickArray = []
var P1WO = false;

var PuntajeJ1 = 0;
var Players = [];
var angle;
var meta;


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

    $("#x").text(Players[0].Bateria);

    $("#lifeP1").css('width', Players[0].Bateria + '%')

    $("#y").text(Players[1].Bateria);

    $("#lifeP2").css('width', 'calc(' + Players[1].Bateria + '% - 40px)')

    $("#z").text("ScoreP1:" + Players[0].Puntaje + " ScoreP2:" + Players[1].Puntaje);

    deltaTime = clock.getDelta();
    var moveF1 = false;
    var moveS1 = false;

    var yaw = 0;
    var forward = 0;
    ///////////////////////
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


    ///////////////////////
    ////RECOGER OBJETOS

    for(var i=0;i<5;i++){
        if (PickArray[i].Recogido == true && PickArray[i].Entregado == false) {
            PickArray[i].Objeto.position.x = PickArray[i].Seguir.position.x;
            PickArray[i].Objeto.position.z = PickArray[i].Seguir.position.z;
        }
        if (PickArray[i].Entregado == false) {
    
            if (PickArray[i].Objeto.position.distanceTo(meta) < 3.0) {
                //PickArray[0].Objeto.remove();
                PickArray[i].Objeto.position.y = -5;
                if (PickArray[i].Seguir == cube)
                    Players[0].Puntaje += 1;
                else
                    Players[1].Puntaje += 1
    
                PickArray[i].Entregado = true;
                //PickArray[0].Objeto.remove();
            }
    
        }
    }


    for(var i=0;i<5;i++){

    }
    if (keys["E"]) {
        for(var i=0;i<5;i++){
            var distance = Math.sqrt(((PickArray[i].Objeto.position.x - cube.position.x) ** 2) + ((PickArray[i].Objeto.position.z - cube.position.z) ** 2));
            if (distance < 1.6 && PickArray[i].Recogido == false) {
                PickArray[i].Seguir = cube;
                PickArray[i].Recogido = true;
                P1WO = true;
            }
        }
    }
    else if (keys["Q"]) {
        for(var i=0;i<5;i++){
            if (PickArray[i].Recogido == true && PickArray[i].Seguir == cube) {
               
                PickArray[i].Recogido = false
                P1WO = false;
            }
        }
    }

    if (keys["O"]) {
        for(var i=0;i<5;i++){
            var distance = Math.sqrt(((PickArray[i].Objeto.position.x - cube2.position.x) ** 2) + ((PickArray[i].Objeto.position.z - cube2.position.z) ** 2));
            if (distance < 1.6 && PickArray[i].Recogido == false) {
                PickArray[i].Seguir = cube2;
                PickArray[i].Recogido = true;
                P1WO = true;
            }
        }
    }
    else if (keys["U"]) {
        for(var i=0;i<5;i++){
            if (PickArray[i].Recogido == true && PickArray[i].Seguir == cube) {
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



    if (Players[0].Bateria > 0 && Players[0].Descargado == false) {
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
        if (Players[1].Turbo) {
            yaw2 = yaw2 * 2;
            forward2 = forward2 * 2;
            Players[1].Bateria -= .05;
        }
    }

    angle = cube.position.angleTo(facing1Prev);
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


    renderer.render(scene, camera);

    facing1Prev.copy(cube.position);
}

function loadFBX(path, onLoadCallback) {

    var loader = new FBXLoader();
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


function setupScene() {

    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    /////////////////////////////////////////////
    meta = new THREE.Vector3();

    Players.push(new Player(0, 100, false));
    Players.push(new Player(0, 100, false));
    var visibleSize = { width: window.innerWidth, height: window.innerHeight };
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, visibleSize.width / visibleSize.height, 0.1, 100);
    //camera.position.z = -10;
    //camera.position.y = 10;

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

    loadFBX("modelos/bot/fbx/bot.fbx", (object) => {
        cube = object;
        cube.position.x = 5;
        cube.position.y = 0.5;
        cube.scale.set(0.2, 0.2, 0.2);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);
    });

    loadFBX("modelos/bot/fbx2/bot.fbx", (object) => {
        cube2 = object;
        cube2.position.x = -5;
        cube2.position.y = 0.5;
        cube2.scale.set(0.2, 0.2, 0.2);
        cube2.castShadow = true;
        cube2.receiveShadow = true;
        scene.add(cube2);
    });

    loadFBX("modelos/stage1/objetos1/llanta/llanta.fbx", (object) => {
        testobj = object;
        testobj.position.set(0, 0, 0);
        testobj.scale.set(.6,.6,.6);
        testobj.castShadow = true;
        testobj.receiveShadow = true;
        scene.add(testobj);
    });

    loadFBX("modelos/stage1/fbx/stage1N.fbx", (object) => {
        object.rotateY(THREE.Math.degToRad(180));
        object.castShadow = true;
        object.receiveShadow = true;
        scene.add(object);
    });

    loadFBX("modelos/king/fbx/king.fbx", (object) => {
        object.rotateY(THREE.Math.degToRad(180));
        object.position.z = 13;
        object.scale.set(0.5, 0.5, 0.5);
        meta.copy(object.position);
        object.castShadow = true;
        object.receiveShadow = true;
        scene.add(object);
    });
    //////RECOGIBLES
    loadFBX("modelos/stage1/objetos1/basura/basura.fbx", (object) => {
        pick2 = object;
        pick2.position.set(7, 0, 0);
        pick2.scale.set(.01,.01,.01);
        pick2.castShadow = true;
        pick2.receiveShadow = true;
        scene.add(pick2);
    });
    loadFBX("modelos/stage1/objetos1/botella/coca.fbx", (object) => {
        pick3 = object;
        pick3.position.set(3, 0, 0);
        pick3.castShadow = true;
        pick3.receiveShadow = true;
        scene.add(pick3);
    });
    loadFBX("modelos/stage1/objetos1/hotDog/fbxHotDog.fbx", (object) => {
        pick4 = object;
        pick4.position.set(-3, 0, 0);
        pick4.scale.set(.3,.3,.3);
        pick4.castShadow = true;
        pick4.receiveShadow = true;
        scene.add(pick4);
    });
    loadFBX("modelos/stage1/objetos1/lata/Perrybox.fbx", (object) => {
        pick5 = object;
        pick5.position.set(-7, 0, 0);
        pick5.scale.set(.05,.05,.05);
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




    //Pickables.push(testobj);
    PickArray.push(new Pickable(testobj, false, testobj, false));
    PickArray.push(new Pickable(pick2, false, pick2, false));
    PickArray.push(new Pickable(pick3, false, pick3, false));
    PickArray.push(new Pickable(pick4, false, pick4, false));
    PickArray.push(new Pickable(pick5, false, pick5, false));

    //scene.add(PickArray);
    //var lol = new Pickable()
    //posT.copy(cube.position);
    xAxis = new THREE.Vector3(1, 0, 0);
    zAxis = new THREE.Vector3(0, 0, 1);
    facing1Prev = new THREE.Vector3(0, 0, 1);
    facing2Prev = new THREE.Vector3(0, 0, 1);

    $("#scene-section").append(renderer.domElement);
}
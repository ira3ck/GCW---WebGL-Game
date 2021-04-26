
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';


var scene;
var camera;
var renderer;
var controls;
var objects = [];
var clock;
var deltaTime;
var keys = {};
var cube, cube2, testobj;
var camMove;
var facing1Prev, facing2Prev;
var posT;
var PickArray = []
var P1WO = false;
var PuntajeJ1 = 0;
var Players = [];

$(document).ready(function () {
    setupScene();
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    render();
});

function loadOBJWithMTL(path, objFile, mtlFile, onLoadCallback) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(path);
    mtlLoader.load(mtlFile, (materials) => {

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(path);
        objLoader.load(objFile, (object) => {
            onLoadCallback(object);
        });

    });
}

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


function render() {
    requestAnimationFrame(render);
    $("#x").empty();
    $("#x").append(Players[0].Bateria);
    $("#y").empty();
    $("#y").append(Players[1].Bateria);
    $("#z").empty();
    $("#z").append("ScoreP1:" + Players[0].Puntaje + " ScoreP2:" + Players[1].Puntaje);

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
    if (PickArray[0].Recogido == true && PickArray[0].Entregado == false) {
        PickArray[0].Objeto.position.x = PickArray[0].Seguir.position.x;
        PickArray[0].Objeto.position.z = PickArray[0].Seguir.position.z;
    }
    if (PickArray[0].Entregado == false) {
        if ((testobj.position.x > -5 && testobj.position.x < 5) && (testobj.position.z > 15)) {
            //PickArray[0].Objeto.remove();
            testobj.position.y = 10;
            if (PickArray[0].Seguir == cube)
                Players[0].Puntaje += 1;
            else
                Players[1].Puntaje += 1

            PickArray[0].Entregado = true;
            //PickArray[0].Objeto.remove();
        }
    }

    if (keys["E"]) {
        var distance = Math.sqrt(((testobj.position.x - cube.position.x) ** 2) + ((testobj.position.z - cube.position.z) ** 2));
        if (distance < 1.6 && PickArray[0].Recogido == false) {
            PickArray[0].Objeto = testobj;
            PickArray[0].Seguir = cube;
            PickArray[0].Recogido = true;
            P1WO = true;
        }
    }
    else if (keys["Q"]) {
        if (PickArray[0].Recogido == true && PickArray[0].Seguir == cube) {
            PickArray[0].Seguir = testobj
            PickArray[0].Recogido = false
            P1WO = false;
        }

    }

    if (keys["O"]) {
        var distance = Math.sqrt(((testobj.position.x - cube2.position.x) ** 2) + ((testobj.position.z - cube2.position.z) ** 2));
        if (distance < 1.6 && PickArray[0].Recogido == false) {
            PickArray[0].Objeto = testobj;
            PickArray[0].Seguir = cube2;
            PickArray[0].Recogido = true;
            P1WO = true;
        }
    }
    else if (keys["U"]) {
        if (PickArray[0].Recogido == true && PickArray[0].Seguir == cube2) {
            PickArray[0].Seguir = testobj
            PickArray[0].Recogido = false
            P1WO = false;
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
            Players[1].Bateria -= .05;
            yaw2 = 5;
            moveS2 = true;
        } else if (keys["L"]) {
            cube2.rotation.y = (270 * Math.PI) / 180;
            Players[1].Bateria -= .05;
            yaw2 = -5;
            moveS2 = true;
        }
        if (keys["I"]) {
            cube2.rotation.y = (0 * Math.PI) / 180;
            Players[1].Bateria -= .05;
            if (keys["J"])
                cube2.rotation.y = (45 * Math.PI) / 180;
            else if (keys["L"])
                cube2.rotation.y = (315 * Math.PI) / 180;
            forward2 = -5;
            moveF2 = true;
        } else if (keys["K"]) {
            cube2.rotation.y = (180 * Math.PI) / 180;
            Players[1].Bateria -= .05;
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

    if (moveF1)
        cube.position.z += -forward * deltaTime;
    if (moveS1)
        cube.position.x += yaw * deltaTime;

    /*if (moveF2)
        cube2.position.z += -forward2 * deltaTime;
    if (moveS2)
        cube2.position.x += yaw2 * deltaTime;*/

    camMove.position.x = (cube.position.x + cube2.position.x) / 20;
    camMove.position.z = (cube.position.z + cube2.position.z) / 20;
    camera.lookAt(camMove.position);


    renderer.render(scene, camera);
    $('#y').text(pos2.y + ', ' + cube2.position.y);

    facing1Prev.copy(cube.position);
    if (!pos2Ant.equals(pos2)) {
        pos2Ant.copy(pos2);
    }
    //cube.position.copy(facing1Prev);
    //$('#x').text(ex);
    //$('#y').text(sed);
    //$('#z').text(angle);
}

function setupScene() {
    Players.push(new Player(0, 100, false));
    Players.push(new Player(0, 100, false));
    var visibleSize = { width: window.innerWidth, height: window.innerHeight };
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, visibleSize.width / visibleSize.height, 0.1, 100);
    camera.position.z = -10;
    camera.position.y = 10;

    camMove = new THREE.Object3D();
    camMove.position.set(0, 0, 0);
    scene.add(camMove);

    pos2 = new THREE.Vector3();
    pos2.set(-5, 0, 0);
    pos2Ant = new THREE.Vector3();
    pos2Ant.set(-5, 0, 0.3);

    renderer = new THREE.WebGLRenderer({ precision: "mediump" });
    renderer.setClearColor(new THREE.Color(0, 0, 0));
    renderer.setPixelRatio(visibleSize.width / visibleSize.height);
    renderer.setSize(visibleSize.width, visibleSize.height);

    var ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1.0);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 0), 0.4);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    var grid = new THREE.GridHelper(50, 10, 0xffffff, 0xffffff);
    grid.position.y = -1;
    scene.add(grid);

    loadOBJWithMTL("modelos/flecha/", "flecha.obj", "flecha2.mtl", (object) => {
        cube = object;
        cube.position.x = 5;
        scene.add(cube);
    });

    loadOBJWithMTL("modelos/flecha/", "flecha.obj", "flecha.mtl", (object) => {
        cube2 = object;
        cube2.position.x = -5;
        scene.add(cube2);
    });
    loadOBJWithMTL("modelos/shit/", "Boya.obj", "Boya.mtl", (object) => {
        testobj = object;
        testobj.position.x = -5;
        scene.add(testobj);
    });

    //Pickables.push(testobj);
    PickArray.push(new Pickable(testobj, false, testobj, false));
    scene.add(PickArray);
    //var lol = new Pickable()

    facing1Prev = new THREE.Vector3(0, 0, 1);
    facing2Prev = new THREE.Vector3(0, 0, 1);

    $("#scene-section").append(renderer.domElement);
}
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
        this.xAnt = 0;
        this.zAnt = 0;
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
var cube, cube2, testobj, pick2, pick3, pick4, pick5, fuenteBateriaO, kinges;
var camMove;
var facing1Prev;
var angle;

var PickArray = [];
var Posiciones = []
var Players = [];
var meta;

var reloj = 60;
var countDown = 5;

var puntuacion = 0, puntuacion2 = 0;

let material = [];
let materialMareo = [];
let particles;
let particlesMareo;
let particlesMareo2;
let count = 0;
let countMareo = 0;

var rayCaster;

var puntosOBJ = 0;
var quitaPuntosOBJ = false;


$(document).ready(function () {

    $('#pauseMenu').hide();

    $('#volver').click(function () {
        $('#pauseMenu').hide();
    })

    setupScene();
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    //////particulas electricas///////////
    const vertices = [];

    const numParticles = 1 * 6;

    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let iyu = 0, jyu = 0;

    for (let ix = 0; ix < 6; ix++) {

        for (let iy = 0; iy < 1; iy++) {

            positions[iyu] = 0; // x
            positions[iyu + 1] = 0; // y
            positions[iyu + 2] = 0; // z

            scales[jyu] = 1;

            iyu += 3;
            jyu++;

        }

    }


    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const sprite = new THREE.TextureLoader().load('img/particula.png');


    material = new THREE.PointsMaterial({ size: 1, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true });
    material.color.setHSL(1.0, 0.3, 0.7);

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    //////////////////////////////////////////////////////
    /////////////////particula mareo////////////////////
    const verticesMareo = [];

    const numParticlesMareo = 1 * 3;

    const positionsMareo = new Float32Array(numParticlesMareo * 3);

    let iMareo = 0, jMareo = 0;

    for (let ix = 0; ix < 3; ix++) {

        for (let iy = 0; iy < 1; iy++) {

            positionsMareo[iMareo] = 0; // x
            positionsMareo[iMareo + 1] = 0; // y
            positionsMareo[iMareo + 2] = 0; // z

            iMareo += 3;
            jMareo++;

        }

    }

    const positionsMareo2 = new Float32Array(numParticlesMareo * 3);

    iMareo = 0, jMareo = 0;

    for (let ix = 0; ix < 3; ix++) {

        for (let iy = 0; iy < 1; iy++) {

            positionsMareo2[iMareo] = 0; // x
            positionsMareo2[iMareo + 1] = 0; // y
            positionsMareo2[iMareo + 2] = 0; // z

            iMareo += 3;
            jMareo++;

        }

    }


    const geometryMareo = new THREE.BufferGeometry();
    geometryMareo.setAttribute('position', new THREE.BufferAttribute(positionsMareo, 3));

    const geometryMareo2 = new THREE.BufferGeometry();
    geometryMareo2.setAttribute('position', new THREE.BufferAttribute(positionsMareo2, 3));

    const spriteMareo = new THREE.TextureLoader().load('img/Mareo.png');


    materialMareo = new THREE.PointsMaterial({ size: 1, sizeAttenuation: true, map: spriteMareo, alphaTest: 0.5, transparent: true });
    materialMareo.color.setHSL(1.0, 0.3, 0.7);

    particlesMareo = new THREE.Points(geometryMareo, materialMareo);
    particlesMareo.geometry.scale(.2, .2, .2)
    particlesMareo.geometry.setDrawRange(0, 0);

    particlesMareo2 = new THREE.Points(geometryMareo2, materialMareo);
    particlesMareo2.geometry.scale(.2, .2, .2)
    particlesMareo2.geometry.setDrawRange(0, 0);
    scene.add(particlesMareo);
    scene.add(particlesMareo2);
    ////////////////////////////////////////////
    ////////////musica////////////////////////
    const listener = new THREE.AudioListener();
    camera.add( listener );
    const sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'musica/bensound-funkyelement.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( localStorage.getItem("volumen"));
        sound.play();
    });


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

    if(keys["X"]){
        
    }

    for (var i = 0; i < 5; i++) {
        PickArray[i].Objeto.visible = false;
        if (PickArray[i].movido == false) {
            PickArray[i].Objeto.position.x = Posiciones[PickArray[i].Origen].Px
            PickArray[i].Objeto.position.z = Posiciones[PickArray[i].Origen].Pz
        }
    }


    if(PickArray[4].Entregado == true){
        for(var i in PickArray)
            PickArray[i].Objeto.position.y = 0.2;
        resetObjects();
    }
       

    deltaTime = clock.getDelta();

    if (contador(deltaTime) && $('#pauseMenu').is(':hidden') && elTiempo(deltaTime)) {

        $('.cargando').hide();

        var moveF1 = false;
        var moveS1 = false;
        var yaw = 0;
        var forward = 0;

        ///////////particulas Electricas/////////////
        const positions = particles.geometry.attributes.position.array;
        const scales = particles.geometry.attributes.scale.array;



        let ipd = 0, jpd = 0;

        for (let ix = 0; ix < 6; ix++) {

            for (let iy = 0; iy < 1; iy++) {

                positions[ipd + 1] = (Math.sin((ix + count) * 0.9) + 2);
                positions[ipd + 0] = fuenteBateriaO.position.x + (Math.sin((ix + count) * 0.3) * 4);
                positions[ipd + 2] = fuenteBateriaO.position.z + (Math.sin((ix + count) * 0.3) * .2);


                ipd += 3;
                jpd++;

            }

        }

        particles.geometry.attributes.position.needsUpdate = true;


        count += 0.1;




        ///////////////////////
        ///////////particulas Mareo/////////////
        const positionsMareo = particlesMareo.geometry.attributes.position.array;
        const positionsMareo2 = particlesMareo2.geometry.attributes.position.array;

        particlesMareo.geometry.rotateY(THREE.Math.degToRad(.2));
        particlesMareo2.geometry.rotateY(THREE.Math.degToRad(.2));



        let ipdMareo = 0, jpdMareo = 0;

        for (let ix = 0; ix < 3; ix++) {


            positionsMareo[ipdMareo + 1] = (Math.sin((ix + countMareo) * 0.01) + 3);
            positionsMareo[ipdMareo + 0] = cube.position.x + (Math.sin((ix + countMareo) * 1) * 1);
            positionsMareo[ipdMareo + 2] = cube.position.z + (Math.sin((ix + countMareo) * 2) * 1);

            positionsMareo2[ipdMareo + 1] = (Math.sin((ix + countMareo) * 0.01) + 3);
            positionsMareo2[ipdMareo + 0] = cube2.position.x + (Math.sin((ix + countMareo) * 1) * 1);
            positionsMareo2[ipdMareo + 2] = cube2.position.z + (Math.sin((ix + countMareo) * 2) * 1);


            ipdMareo += 3;
            jpdMareo++;

        }

        particlesMareo.geometry.attributes.position.needsUpdate = true;
        particlesMareo2.geometry.attributes.position.needsUpdate = true;


        countMareo += 0.03;


        ////CARGA
        if (Players[0].Bateria < 100) {
            if ((cube.position.z > -10 && cube.position.z < -5) && (cube.position.x > -5 && cube.position.x < 5)) {
                Players[0].Bateria += 0.1;
            }
        }

        if (Players[1].Bateria < 100) {
            if ((cube2.position.z > -10 && cube2.position.z < -5) && (cube2.position.x > -5 && cube2.position.x < 5)) {
                Players[1].Bateria += 0.1;
            }
        }
        ////DESCARGADOS
        if (Players[0].Bateria < 0) {
            cube.position.z = fuenteBateriaO.position.z;
            cube.position.x = fuenteBateriaO.position.x - 1.4;
            Players[0].Descargado = true;
            Players[0].Turbo = false;

            if (cube.position.distanceTo(cube2.position) < 1.5)
                cube2.position.x += 1.4;
            puntuacion -= 50;
        }
        if (Players[0].Bateria > 30)
            Players[0].Descargado = false;

        if (Players[1].Bateria < 0) {
            cube2.position.z = fuenteBateriaO.position.z;
            cube2.position.x = fuenteBateriaO.position.x + 1.4;
            Players[1].Descargado = true;
            Players[1].Turbo = false;

            if (cube2.position.distanceTo(cube.position) < 1.5)
                cube.position.x -= 1.4;
            puntuacion2 -= 50;
        }
        if (Players[1].Bateria > 30)
            Players[1].Descargado = false;

/////////ENTREGADOS

        for (var i = 0; i < 5; i++) {
            if (PickArray[i].Activado) {
                console.log("Esta activo el " + i);
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


                ////////////ENTREGAR/////////////
                if (PickArray[i].Entregado == false) {

                    if (PickArray[i].Objeto.position.distanceTo(meta) < 3.0) {
                        //PickArray[0].Objeto.remove();
                        PickArray[i].Objeto.position.y = -5;
                        if (PickArray[i].Seguir == cube) {
                            Players[0].Puntaje += 1;
                            puntuacion += puntosOBJ;
                            puntosOBJ = 0;
                            quitaPuntosOBJ = false;
                        }
                        else {
                            Players[1].Puntaje += 1;
                            puntuacion2 += puntosOBJ;
                            puntosOBJ = 0;
                            quitaPuntosOBJ = false;
                        }

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

        //////////RECOGER OBJETOS///////////////
        ///////////JUGADOR 1/////////////
        if (keys["E"]) {
            for (var i = 0; i < 5; i++) {
                var distance = Math.sqrt(((PickArray[i].Objeto.position.x - cube.position.x) ** 2) + ((PickArray[i].Objeto.position.z - cube.position.z) ** 2));
                if (distance < 1.6 && PickArray[i].Recogido == false) {
                    PickArray[i].Seguir = cube;
                    PickArray[i].Recogido = true;
                    PickArray[i].movido = true;

                    if (puntosOBJ == 0) {
                        puntosOBJ = 1000;
                    }
                    quitaPuntosOBJ = true;
                }
            }
        }
        else if (keys["Q"]) {
            for (var i = 0; i < 5; i++) {
                if (PickArray[i].Recogido == true && PickArray[i].Seguir == cube) {

                    PickArray[i].Recogido = false;

                    quitaPuntosOBJ = false;
                }
            }
        }

        ///////////JUGADOR 2/////////////
        if (keys["O"]) {
            for (var i = 0; i < 5; i++) {
                var distance = Math.sqrt(((PickArray[i].Objeto.position.x - cube2.position.x) ** 2) + ((PickArray[i].Objeto.position.z - cube2.position.z) ** 2));
                if (distance < 1.6 && PickArray[i].Recogido == false) {
                    PickArray[i].Seguir = cube2;
                    PickArray[i].Recogido = true;
                    PickArray[i].movido = true;

                    if (puntosOBJ == 0) {
                        puntosOBJ = 1000;
                    }
                    quitaPuntosOBJ = true;
                }
            }
        }
        else if (keys["U"]) {
            for (var i = 0; i < 5; i++) {
                if (PickArray[i].Recogido == true && PickArray[i].Seguir == cube2) {
                    PickArray[i].Seguir = PickArray[i].Objeto;
                    PickArray[i].Recogido = false;

                    quitaPuntosOBJ = false;
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
                puntuacion += 50;
                particlesMareo2.geometry.setDrawRange(0, Infinity);
                for (var i = 0; i < 5; i++) {
                    if (PickArray[i].Recogido == true && PickArray[i].Seguir == cube2) {
                        PickArray[i].Seguir = PickArray[i].Objeto;
                        PickArray[i].Recogido = false;

                        quitaPuntosOBJ = false;
                    }
                }

            }

        }

        if (keys["H"]) {
            var distance = Math.sqrt(((cube.position.x - cube2.position.x) ** 2) + ((cube.position.z - cube2.position.z) ** 2));
            if (distance < 2 && Players[0].Aturdido == false) {
                Players[1].Bateria -= 10;
                Players[0].Aturdido = true;
                puntuacion2 += 50;
                particlesMareo.geometry.setDrawRange(0, Infinity);
                for (var i = 0; i < 5; i++) {
                    if (PickArray[i].Recogido == true && PickArray[i].Seguir == cube) {
                        PickArray[i].Seguir = PickArray[i].Objeto;
                        PickArray[i].Recogido = false;

                        quitaPuntosOBJ = false;
                    }
                }

            }
        }

        for (var i = 0; i < 2; i++) {
            Players[i].StunnedTime += .2;
            if (Players[i].Aturdido == true && Players[i].StunnedTime > 9) {
                Players[i].Aturdido = false;
                particlesMareo.geometry.setDrawRange(0, 0);
                particlesMareo2.geometry.setDrawRange(0, 0);
                Players[i].StunnedTime = 0;
            }
        }
        /////////////////

        if (Players[0].Bateria > 0 && Players[0].Descargado == false && Players[0].Aturdido == false) {

            if (keys["A"]) {
                cube.rotation.y = (90 * Math.PI) / 180;
                Players[0].Bateria -= 0.05;
                yaw = 5;
                moveS1 = true;
            } else if (keys["D"]) {
                cube.rotation.y = (270 * Math.PI) / 180;
                Players[0].Bateria -= 0.05;
                yaw = -5;
                moveS1 = true;
            }
            if (keys["W"]) {
                cube.rotation.y = (0 * Math.PI) / 180;
                Players[0].Bateria -= 0.05;
                if (keys["A"])
                    cube.rotation.y = (45 * Math.PI) / 180;
                else if (keys["D"])
                    cube.rotation.y = (315 * Math.PI) / 180;
                forward = -5;
                moveF1 = true;
            } else if (keys["S"]) {
                cube.rotation.y = (180 * Math.PI) / 180;
                Players[0].Bateria -= 0.05;
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
                Players[0].Bateria -= 0.05;
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
                Players[1].Bateria -= 0.05;
            }

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


        colisiona(cube, cube2, Players[0]);
        colisiona(cube2, cube, Players[1]);
        Players[0].xAnt = cube.position.x;
        Players[0].zAnt = cube.position.z;
        Players[1].xAnt = cube2.position.x;
        Players[1].zAnt = cube2.position.z;

        camMove.position.x = (cube.position.x + cube2.position.x) / 20;
        camMove.position.z = (cube.position.z + cube2.position.z) / 20;

        camera.lookAt(camMove.position);
        camera.position.set(0, 15, camMove.position.z - 10);

        updateHUD(Players);
        highscore(puntuacion, puntuacion2);

        renderer.render(scene, camera);

        facing1Prev.copy(cube.position);
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

    if (quitaPuntosOBJ) {
        puntosOBJ -= 1 * deltatime;
        puntosOBJ = Math.floor(puntosOBJ);
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

    $("#scoreP1").text(puntuacion);

    $("#scoreP2").text(puntuacion2);

    ////////BORRAR//////////
    //$("#scoreP1").text(cube.position.x + ', ' + cube.position.z);
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
    if (one > two) {
        $('#highscore').text(one);
        $('#nameWinner').text('Ganador: Jugador 1');
        $('#playerHighScore').val('Jugador 1');
    }
    else {
        $('#highscore').text(two);
        $('#nameWinner').text('Ganador: Jugador 2');
        $('#playerHighScore').val('Jugador 2');
    }
}

function colisiona(mono, mono2, player) {
    for (var i = 0; i < mono.misRayos.length; i++) {

        var rayo = mono.misRayos[i];

        rayCaster.set(mono.position, rayo);

        var colisiones = rayCaster.intersectObjects(objects, true);

        colisiones.forEach(element => {
            if (element.distance < 1) {
                mono.position.x = player.xAnt;
                mono.position.z = player.zAnt;
            }
        });

        var colisiones2 = rayCaster.intersectObject(mono2, true);

        colisiones2.forEach(element => {
            if (element.distance < 1) {

                mono.position.x = player.xAnt;
                mono.position.z = player.zAnt;

                console.log("colision");
            }
        });

    }
}

//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
function resetObjects(){
    
    for(var i in Posiciones){
        Posiciones[i].tomada=false;
    }
    for(var i in PickArray){
        PickArray[i].Recogido = false;
        PickArray[i].Seguir = PickArray[i].Objeto;
        PickArray[i].Entregado = false;
        PickArray[i].Activado = false;
        PickArray[i].movido = false;
        var k = 0;
        do {
            k = Math.floor(Math.random() * Posiciones.length);
        } while (Posiciones[k].tomada == true)
        PickArray[i].Origen = k;
        Posiciones[k].tomada = true;
        
    }
    PickArray[0].Activado = true;
    
}
$('#submitScore').click(function () {
    var score = $('#highscore').text();
    shareScore(score);
});

function setupScene() {

    meta = new THREE.Vector3();

    Players.push(new Player(0, 100, false));
    Players.push(new Player(0, 100, false));
    var visibleSize = { width: window.innerWidth, height: window.innerHeight };
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, visibleSize.width / visibleSize.height, 0.1, 100);

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


    rayCaster = new THREE.Raycaster();


    loadFBX(manager, "modelos/bot/fbx/bot.fbx", (object) => {
        cube = object;
        cube.position.x = 5;
        cube.position.y = 0.5;
        cube.scale.set(0.2, 0.2, 0.2);
        cube.castShadow = true;
        cube.receiveShadow = true;

        cube.misRayos = [
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0)
        ];

        scene.add(cube);
    });

    loadFBX(manager, "modelos/bot/fbx2/bot.fbx", (object) => {
        cube2 = object;
        cube2.position.x = -5;
        cube2.position.y = 0.5;
        cube2.scale.set(0.2, 0.2, 0.2);
        cube2.castShadow = true;
        cube2.receiveShadow = true;

        cube2.misRayos = [
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0)
        ];

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

        objects.push(object);

        scene.add(object);
    });

    loadFBX(manager, "modelos/king/fbx/king.fbx", (object) => {
        kinges = object;
        kinges.rotateY(THREE.Math.degToRad(180));
        kinges.position.z = 13;
        kinges.scale.set(0.5, 0.5, 0.5);
        meta.copy(object.position);
        kinges.castShadow = true;
        kinges.receiveShadow = true;

        objects.push(kinges);

        scene.add(kinges);
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
        pick3.rotation.x = THREE.Math.degToRad(15);
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
        pick5.position.set(-7, 0.5, 0);
        pick5.scale.set(0.05, 0.05, 0.05);
        pick5.castShadow = true;
        pick5.receiveShadow = true;
        scene.add(pick5);
    });
    loadFBX(manager, "modelos/FuenteBateriaFBX/FuenteBateria.fbx", (object) => {
        fuenteBateriaO = object;
        fuenteBateriaO.position.set(0, .2, -9);
        fuenteBateriaO.scale.set(1.6, 1.6, 1.6);
        fuenteBateriaO.rotateY(THREE.Math.degToRad(90));
        fuenteBateriaO.castShadow = true;
        fuenteBateriaO.receiveShadow = true;

        objects.push(fuenteBateriaO);

        scene.add(fuenteBateriaO);
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

    Posiciones.push(new RndPosition(6.47, -5.29))
    Posiciones.push(new RndPosition(0, -2.17))
    Posiciones.push(new RndPosition(10, 1.47))
    Posiciones.push(new RndPosition(-0.53, 2.9))
    Posiciones.push(new RndPosition(-5.4, -4.8))
    Posiciones.push(new RndPosition(-11.2, 0.71))
    Posiciones.push(new RndPosition(-9.17, 7.52))


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
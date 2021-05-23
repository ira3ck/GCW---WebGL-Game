import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';

import 'https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js';

import 'https://www.gstatic.com/firebasejs/8.4.1/firebase-database.js'


var scene;
		var camera;
		var renderer;
		var controls;
		var objects = [];
		var clock;
		var deltaTime;
		var keys = {};
		var cube;
		var jugadores = [];
		var update = false;
		var userName;
		var myKey;
		$(document).ready(function () {
			setupScene();

			document.addEventListener('keydown', onKeyDown);
			document.addEventListener('keyup', onKeyUp);

			const dbRefPlayers = firebase.database().ref().child("jugadores");


			dbRefPlayers.on("child_added", (snap) => {
				var player = snap.val();
				var key = snap.key;

				var newObject = creatObject(new THREE.Color(player.color.r, player.color.g, player.color.b));
				scene.add(newObject);
				newObject.player = player;
				newObject.key = key;

				jugadores.push(newObject);


			});

			dbRefPlayers.on("child_changed", (snap) => {
				var player = snap.val();
				var key = snap.key;

				for (var i = 0; i < jugadores.length; i++) {
					if (jugadores[i].key == key) {
						jugadores[i].player = player;
					}
				}
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

		window.onbeforeunload = closingCode;
		function closingCode() {
			deletePlayer();
			return null;
		}


		function render() {
			requestAnimationFrame(render);
			deltaTime = clock.getDelta();

			var currentPlayer;
			var currentKey;
			var place;


			for (var i = 0; i < jugadores.length; i++) {
				if (jugadores[i].player.nombre == userName) {
					currentPlayer = jugadores[i].player;
					currentKey = jugadores[i].key;
					myKey = currentKey;
					place = i;
					update = true;
				}
			}

			var yaw = 0;
			var forward = 0;
			if (keys["A"]) {
				yaw = 5;
			} else if (keys["D"]) {
				yaw = -5;
			}
			if (keys["W"]) {
				forward = -5;
			} else if (keys["S"]) {
				forward = 5;
			}


			if (update) {
				jugadores[place].rotation.y += yaw * deltaTime;
				jugadores[place].translateZ(forward * deltaTime);

				currentPlayer.position.x = jugadores[place].position.x;
				currentPlayer.position.y = jugadores[place].position.y;
				currentPlayer.position.z = jugadores[place].position.z;
				currentPlayer.rotation.x = jugadores[place].rotation.x;
				currentPlayer.rotation.y = jugadores[place].rotation.y;
				currentPlayer.rotation.z = jugadores[place].rotation.z;

				updateFirebase(currentPlayer, currentKey);
			}


			for (var i = 0; i < jugadores.length; i++) {

				jugadores[i].rotation.x = jugadores[i].player.rotation.x;
				jugadores[i].rotation.y = jugadores[i].player.rotation.y;
				jugadores[i].rotation.z = jugadores[i].player.rotation.z;
				jugadores[i].position.x = jugadores[i].player.position.x;
				jugadores[i].position.y = jugadores[i].player.position.y;
				jugadores[i].position.z = jugadores[i].player.position.z;

			}

			renderer.render(scene, camera);

			$('#llave').text(myKey);
		}

		function setupScene() {
			var visibleSize = { width: window.innerWidth, height: window.innerHeight };
			clock = new THREE.Clock();
			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(75, visibleSize.width / visibleSize.height, 0.1, 100);
			camera.position.z = 2;
			camera.position.y = 2;

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

			$("#scene-section").append(renderer.domElement);
		}

		function creatObject(color) {

			var material = new THREE.MeshLambertMaterial({ color });
			var geometry = new THREE.BoxGeometry(1, 1, 1);
			var jugador = new THREE.Mesh(geometry, material);



			return jugador;
		}

		function createPlayer() {
			var nombre = $("#txtName").val();
			userName = nombre;
			$("#container").hide();

			var position = { x: 0, y: 0, z: 0 };
			var rotation = { x: 0, y: 0, z: 0 };
			var color = { r: Math.random(), g: Math.random(), b: Math.random() }
			const dbRefPlayers = firebase.database().ref().child("jugadores");

			var newPlayer = dbRefPlayers.push();
			newPlayer.set({
				nombre,
				position,
				rotation,
				color
			});

		}

		function updateFirebase(currentPlayer, currentKey) {
			const dbRefPlayers = firebase.database().ref().child(`jugadores/${currentKey}`);

			dbRefPlayers.update({
				nombre: currentPlayer.nombre,
				position: currentPlayer.position,
				rotation: currentPlayer.rotation
			})

		}

		function deletePlayer() {
			const dbRefPlayers = firebase.database().ref().child(`jugadores/${myKey}`);
			dbRefPlayers.remove();
		}

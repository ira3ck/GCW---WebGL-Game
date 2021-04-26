import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';


function loadFBXmodel(path, name){
    var modelo;
    var loader = new FBXLoader();
    loader.load(path, function (object) {

        mixer = new THREE.AnimationMixer(object);

        const action = mixer.clipAction(object.animations[0]);
        defeated = action;
        action.play();

        object.traverse(function (child) {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });
        object.name = name;

        modelo = object;

    });

    return modelo;
}

function updateFBXmodel(name, position, rotation, scale){

    var modelo = scene.getObjectByName(name);

    modelo.position.copy(position);
    modelo.rotation.x = rotation.x;
    modelo.rotation.y = rotation.y;
    modelo.rotation.z = rotation.z;
    modelo.scale.divideSclalar(scale);

}

function cloneFBXmodel(name){

    var modelo = scene.getObjectByName(name);


}
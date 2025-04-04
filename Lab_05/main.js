import * as THREE from "three"
import GetCamera from "./camera";
import GetBox from "./objects/box";
import GetPolyhedronGeometry from "./objects/polyhedrongeometry";
import GetSphere from "./objects/sphere";
import GetTorus from "./objects/torus";
import GetCylinder from "./objects/cylinder";

function init() 
{
    const scene = new THREE.Scene();
    const camera = GetCamera(0,0,5);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var box = GetBox(1,1,1);
    var polyhedrongeometry = GetPolyhedronGeometry();
    polyhedrongeometry.position.z = -10;
    polyhedrongeometry.position.x = -10;
    var sphere = GetSphere();
    sphere.position.x = 3;

    var torus = GetTorus();
    torus.position.y = 2;
    
    var cylinder = GetCylinder();
    cylinder.position.y = -3;
    


    scene.add(box);
    scene.add(polyhedrongeometry);
    scene.add(sphere);
    scene.add(torus);
    scene.add(cylinder);
    renderer.setAnimationLoop(() => animate([box, polyhedrongeometry, sphere, torus, cylinder], renderer, scene, camera));   

    
    
}

function animate(objects, renderer, scene, camera) {
    objects.forEach(object => {
        object.rotation.x += 0.01;
        object.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}
init();
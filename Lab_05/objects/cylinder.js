import * as THREE from "three";


const GetCylinder = () => 
{
    const geometry = new THREE.CylinderGeometry( 1, 1, 2, 32); 
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} ); 
    const cylinder = new THREE.Mesh( geometry, material ); 
    return cylinder;
}

export default GetCylinder
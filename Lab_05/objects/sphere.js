import * as  THREE from "three";

const GetSphere = () =>
{
    const geometry = new THREE.SphereGeometry( 1, 16, 32 ); 
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
    const sphere = new THREE.Mesh( geometry, material );
    return sphere;
}

export default GetSphere;
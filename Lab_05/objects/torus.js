import * as THREE from "three"

const GetTorus = () => 
{
    const geometry = new THREE.TorusGeometry( 1, 0.5, 16, 100 ); 
    const material = new THREE.MeshBasicMaterial( { color: 0xff3800 } ); 
    const torus = new THREE.Mesh( geometry, material );
    return torus;
}

export default GetTorus;
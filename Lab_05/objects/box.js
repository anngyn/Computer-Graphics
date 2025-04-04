import * as THREE from "three";

const GetBox = (w = 1, h = 1,d = 1) =>
{
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshBasicMaterial(
        {
            color: 0x00ff00
        }
    );
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    return mesh;
}

export default GetBox;
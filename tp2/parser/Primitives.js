import * as THREE from 'three';
import { rgbToHex } from './utils.js';

const map = {
    "pointlight": buildPointlight,
    "rectangle": buildRetangle,
    "triangle":buildTriangle,
    "box": buildBox,

}

export function buildPrimitive(primitive, material){
    console.log(primitive)
    const func = map[primitive.type]
    if(func) return func(primitive, material)
    else console.log(primitive["type"] + " not defined yet")
}

function buildRetangle(rectangle, material){
    let width = Math.abs(rectangle["xy2"]["x"] - rectangle["xy1"]["x"] )
    let height = Math.abs(rectangle["xy2"]["y"] - rectangle["xy1"]["y"] )
    let widthSegments = rectangle["parts_x"] ? rectangle["parts_x"] : 1 
    let heightSegments = rectangle["parts_y"] ? rectangle["parts_y"] : 1 
    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    const rectangleMesh = new THREE.Mesh(geometry, material);
    //rectangleMesh.position.copy (new THREE.Vector3(rectangle["xy1"]["x"] , rectangle["xy1"]["y"],0 ))
    return rectangleMesh
}

function buildPointlight(pointlight, material){

    const pointLight = new THREE.PointLight(rgbToHex(pointlight["color"]), pointlight["intensity"], pointlight["distance"], pointlight["decay"]);  
    pointLight.position.set(pointlight.position.x, pointlight.position.y, pointlight.position.z);
    pointLight.castShadow = pointlight.castshadow
    return pointLight
}

function buildTriangle(triangle, material){

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        triangle["xyz1"]["x"],triangle["xyz1"]["y"],triangle["xyz1"]["z"],
        triangle["xyz2"]["x"],triangle["xyz2"]["y"],triangle["xyz2"]["z"],
        triangle["xyz3"]["x"],triangle["xyz3"]["y"],triangle["xyz3"]["z"]
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const triangleMesh = new THREE.Mesh(geometry, material);
    return triangleMesh
}

function buildBox(box, material){
 
    const width = Math.abs(box["xyz2"]["x"] - box["xyz1"]["x"])
    const height = Math.abs(box["xyz2"]["y"] - box["xyz1"]["y"])
    const depth = Math.abs(box["xyz2"]["z"] - box["xyz1"]["z"])
    const parts_x = box["parts_x"] ? box["parts_x"] : 1
    const parts_y = box["parts_y"] ? box["parts_y"] : 1
    const parts_z = box["parts_z"] ? box["parts_z"] : 1
    let geometry = new THREE.BoxGeometry(width, height, depth,parts_x,parts_y,parts_z );

    let boxMesh = new THREE.Mesh(geometry, material);

 
    console.log(boxMesh)

    return boxMesh

}

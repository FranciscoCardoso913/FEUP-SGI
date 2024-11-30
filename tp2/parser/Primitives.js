import * as THREE from 'three';
import { rgbToHex } from './utils.js';

const map = {
    "pointlight": buildPointlight,
    "rectangle": buildRetangle

}

export function buildPrimitive(primitive, material){
    console.log(primitive)
    const func = map[primitive.type]
    if(func) return func(primitive, material)
    else console.log(primitive["type"] + " not defined yet")
}

function buildRetangle(rectangle, material){
    let width = rectangle["xy2"]["x"] - rectangle["xy1"]["x"] 
    let height = rectangle["xy2"]["y"] - rectangle["xy1"]["y"] 
    let widthSegments = rectangle["parts_x"] ? rectangle["parts_x"] : 1 
    let heightSegments = rectangle["parts_y"] ? rectangle["parts_y"] : 1 
    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    const rectangleMesh = new THREE.Mesh(geometry, material);
    rectangleMesh.position.copy (new THREE.Vector3(rectangle["xy1"]["x"] , rectangle["xy1"]["y"],0 ))
    return rectangleMesh
}

function buildPointlight(pointlight, material){

    const pointLight = new THREE.PointLight(rgbToHex(pointlight["color"]), pointlight["intensity"], pointlight["distance"], pointlight["decay"]);  
    pointLight.position.set(pointlight.position.x, pointlight.position.y, pointlight.position.z);
    pointLight.castShadow = pointlight.castshadow
    return pointLight



}
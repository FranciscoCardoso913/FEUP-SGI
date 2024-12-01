import * as THREE from 'three';
import { rgbToHex } from './utils.js';
import { MyNurbsBuilder } from '../MyNurbsBuilder.js';

const map = {
    "pointlight": buildPointlight,
    "rectangle": buildRetangle,
    "triangle":buildTriangle,
    "box": buildBox,
    "cone": buildCone,
    "sphere": buildSphere,
    "nurbs": buildNurbs,
    "spotlight": buildSpotlight

}

export function buildPrimitive(primitive, material){
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
    return boxMesh
}

function buildCone(cone, material){
 
    const geometry = new THREE.CylinderGeometry(
        cone["top"],
        cone["base"],
        cone["height"],
        cone["slices"],
        cone["stacks"],
        !(cone["capsClose"] ? cone["capsClose"]: false),
        (cone["thetaStart"] ? cone["thetaStart"] : 0),
        (cone["thetaLength"] ? cone["thetaLength"]: Math.PI*2)
    );
    const cylinder = new THREE.Mesh(geometry, material);

    return cylinder

}

function buildSphere(sphere, material){

    const geometry = new THREE.SphereGeometry(
        sphere["radius"],
        sphere["slices"],
        sphere["stacks"],
        (sphere["phiStart"] ? sphere["phiStart"]: 0),
        (sphere["phiLength"] ? sphere["phiLength"]: Math.PI*2),
        (sphere["thetaStart"] ? sphere["thetaStart"]: 0),
        (sphere["thetaLength"] ? sphere["thetaLength"]: Math.PI*2),
    );
    
    const sphereMesh = new THREE.Mesh(geometry, material);

    return sphereMesh

}

function buildNurbs(nurbs, material){
    let controlPoints= [];
    let surfaceData;
    const samplesU = nurbs["parts_u"]
    const samplesV = nurbs["parts_v"]
    const orderU = nurbs["degree_u"]
    const orderV = nurbs["degree_v"]

    const builder = new MyNurbsBuilder()

    for(let u = 0; u<orderU;u++){
        let aux = []
        for (let v = 0; v < orderV; v++){
            let point =nurbs["controlpoints"][u*orderV + v]
            aux.push([point["x"], point["y"], point["z"]])
        }
        controlPoints.push(aux)
    }


    surfaceData = builder.build(controlPoints,
                orderU, orderV, samplesU,
                samplesV, material)  
    const mesh = new THREE.Mesh( surfaceData, material );
    return mesh
}

function buildSpotlight(spotLight,material ){
    const enabled = spotLight.enabled ?? true;
    const color = rgbToHex(spotLight.color);
    const intensity = spotLight.intensity ?? 1;
    const distance = spotLight.distance ?? 1000;
    const angle = spotLight.angle;
    const decay = spotLight.decay ?? 2;
    const penumbra = spotLight.penumbra ?? 1;
    const position = spotLight.position;
    const targetPosition = spotLight.targetPosition;
    const castShadow = spotLight.castShadow ?? false;
    const shadowFar = spotLight.shadowFar ?? 500;
    const shadowMapSize = spotLight.shadowMapSize ?? 512;

    if (enabled) {
        const spotlight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
        spotlight.position.set(position.x, position.y, position.z);
        spotlight.castShadow = castShadow;
        spotlight.shadow.camera.far = shadowFar;
        spotlight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    
        const target = new THREE.Object3D();
        target.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
        spotlight.target = target;
        return spotlight
    }
    return null
}

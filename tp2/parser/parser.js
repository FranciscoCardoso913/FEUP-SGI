import {rgbToHex} from './utils.js'
import * as THREE from 'three';


export function parseAmbientLight(ambient){
    const color = rgbToHex(ambient)
    return new  THREE.AmbientLight(color)
}

export function parseFog(fog){
    const color = rgbToHex(fog["color"])
    return new THREE.Fog(color, fog["near"], fog["far"]);
}

export function parseSkybox(skybox){
    const textureLoader = new THREE.TextureLoader();
    const front = textureLoader.load(skybox["front"]);
    const back = textureLoader.load(skybox["back"]);
    const up = textureLoader.load(skybox["up"]);
    const down = textureLoader.load(skybox["down"]);
    const left = textureLoader.load(skybox["left"]);
    const right = textureLoader.load(skybox["right"]);
    const emissive = rgbToHex(skybox["emissive"])
    
    const planeGeometry1 = new THREE.PlaneGeometry(skybox["size"]["x"], skybox["size"]["y"], skybox["size"]["x"], skybox["size"]["y"]);
    const planeGeometry2 = new THREE.PlaneGeometry(skybox["size"]["y"], skybox["size"]["z"], skybox["size"]["y"], skybox["size"]["z"]);
    const planeGeometry3 = new THREE.PlaneGeometry(skybox["size"]["z"], skybox["size"]["x"], skybox["size"]["z"], skybox["size"]["x"]);

    const planeMaterialFront = new THREE.MeshPhongMaterial({
        map: front,
        emissive: emissive
    });
    const planeMaterialBack = new THREE.MeshPhongMaterial({
        map: back,
        emissive: emissive
    });
    const planeMaterialUp = new THREE.MeshPhongMaterial({
        map: up,
        emissive: emissive
    });
    const planeMaterialDown = new THREE.MeshPhongMaterial({
        map: down,
        emissive: emissive
    });
    const planeMaterialLeft = new THREE.MeshPhongMaterial({
        map: left,
        emissive: emissive
    });
    const planeMaterialRight = new THREE.MeshPhongMaterial({
        map: right,
        emissive: emissive
    });
    let skyboxGroup = new THREE.Group()

    const frontPlane = new THREE.Mesh(planeGeometry1, planeMaterialFront) 
    const backPlane = new THREE.Mesh(planeGeometry1, planeMaterialBack) 
    const upPlane = new THREE.Mesh(planeGeometry3, planeMaterialUp) 
    const downPlane = new THREE.Mesh(planeGeometry3, planeMaterialDown) 
    const leftPlane = new THREE.Mesh(planeGeometry2, planeMaterialLeft) 
    const rightPlane = new THREE.Mesh(planeGeometry2, planeMaterialRight) 

    frontPlane.position.z = -skybox["size"]["z"]/2
    backPlane.rotateY(Math.PI)
    backPlane.position.z = skybox["size"]["z"]/2
    upPlane.rotateX( Math.PI/2)
    downPlane.rotateX( -Math.PI/2)
    upPlane.position.y = skybox["size"]["y"]/2
    downPlane.position.y = -skybox["size"]["y"]/2
    leftPlane.rotateY(Math.PI/2)
    rightPlane.rotateY(-Math.PI/2)
    leftPlane.position.x = -skybox["size"]["x"]/2
    rightPlane.position.x = skybox["size"]["x"]/2

    skyboxGroup.add(frontPlane)
    skyboxGroup.add(backPlane)
    skyboxGroup.add(upPlane)
    skyboxGroup.add(downPlane)
    skyboxGroup.add(leftPlane)
    skyboxGroup.add(rightPlane)

    return skyboxGroup
  

}
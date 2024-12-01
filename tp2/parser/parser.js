import {rgbToHex} from './utils.js'
import * as THREE from 'three';
import { Node } from './Node.js';

export function parseAmbientLight(ambient){
    const color = rgbToHex(ambient)
    return new  THREE.AmbientLight(color, ambient["intensity"])
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

    const planeMaterialFront = new THREE.MeshPhongMaterial({map: front,emissive: emissive});
    const planeMaterialBack = new THREE.MeshPhongMaterial({map: back,emissive: emissive});
    const planeMaterialUp = new THREE.MeshPhongMaterial({map: up,emissive: emissive});
    const planeMaterialDown = new THREE.MeshPhongMaterial({map: down,emissive: emissive});
    const planeMaterialLeft = new THREE.MeshPhongMaterial({map: left,emissive: emissive});
    const planeMaterialRight = new THREE.MeshPhongMaterial({map: right,emissive: emissive});
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

export function parseTextures(textures){
    return Object.entries(textures).reduce((dict, [name, value]) => {
        let texture;
        if(value.isVideo){
            const video = document.createElement('video');
            video.src = value.filepath; 
            video.loop = true; 
            video.muted = true; 
            video.play(); 
            texture = new THREE.VideoTexture(video);
        }
        else{
            texture = new THREE.TextureLoader().load(value.filepath)
            texture.wrapS = THREE.RepeatWrapping; // Repeat horizontally
            texture.wrapT = THREE.RepeatWrapping; // Repeat vertically
            texture.minFilter = THREE.LinearMipmapLinearFilter; 
            texture.mipmaps = []
            for( let i =0; i<= 7;i++){
                if(value["mipmap"+i.toString()]){
                    texture.mipmaps.append(value["mipmap"+i.toString()]);
                }else break;
            }

        }
        dict[name] = texture;
        return dict;
    }, {});
}


export function parseMaterials(textures, materials){
    return Object.entries(materials).reduce((dict, [name, value]) => {

        let material =new THREE.MeshPhongMaterial({ 
            color: rgbToHex(value.color), 
            specular: rgbToHex(value.specular),
            shininess: value.shininess,
            emissive: rgbToHex(value.emissive),
            transparent: value.transparent,
            opacity: value.opacity,
            side: value.twosided? THREE.DoubleSide : THREE.FrontSide,
            wireframe: value.wireframe? value.wireframe : false
        })
        let texture = textures[value.textureref]
        if(texture){
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping;
 
            texture.repeat.set(
                value.texlength_s, 
                value.texlength_t 
            );
            material.map = texture
        }
        dict[name] = material;
        return dict;
    }, {});
}

export function parseNodes(graph){
    return Object.entries(graph).reduce((dict, [name, value]) => {
        if(name !== "rootid"){
            dict[name] = new Node(value)
        }
        return dict;
    }, {});

}

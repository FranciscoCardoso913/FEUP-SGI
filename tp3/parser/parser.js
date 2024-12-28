import {rgbToHex, loadMipmap, parseNodeName} from './utils.js'
import * as THREE from 'three';
import { Node } from './Node.js';


/**
 * Parses Ambient Light
 * @param {*} ambient ambient Light information
 * @returns Ambient Light
 */
export function parseAmbientLight(ambient){
    const color = rgbToHex(ambient)
    return new  THREE.AmbientLight(color, ambient["intensity"])
}

/**
 * Parses fog
 * @param {*} fog fog information
 * @returns fog
 */
export function parseFog(fog){
    const color = rgbToHex(fog["color"])
    return new THREE.Fog(color, fog["near"], fog["far"]);
}

/**
 * Parses skybox
 * @param {*} skybox skybox information
 * @returns Skybox mesh
 */
export function parseSkybox(skybox){

    //Load textures
    const textureLoader = new THREE.TextureLoader();
    const front = textureLoader.load(skybox["front"]);
    const back = textureLoader.load(skybox["back"]);
    const up = textureLoader.load(skybox["up"]);
    const down = textureLoader.load(skybox["down"]);
    const left = textureLoader.load(skybox["left"]);
    const right = textureLoader.load(skybox["right"]);
    const emissive = rgbToHex(skybox["emissive"])
    
    // Creates plan geometires
    const planeGeometry1 = new THREE.PlaneGeometry(skybox["size"]["x"], skybox["size"]["y"], skybox["size"]["x"], skybox["size"]["y"]);
    const planeGeometry2 = new THREE.PlaneGeometry(skybox["size"]["y"], skybox["size"]["z"], skybox["size"]["y"], skybox["size"]["z"]);
    const planeGeometry3 = new THREE.PlaneGeometry(skybox["size"]["z"], skybox["size"]["x"], skybox["size"]["z"], skybox["size"]["x"]);

    // Create materials
    const planeMaterialFront = new THREE.MeshPhongMaterial({map: front,emissive: emissive});
    const planeMaterialBack = new THREE.MeshPhongMaterial({map: back,emissive: emissive});
    const planeMaterialUp = new THREE.MeshPhongMaterial({map: up,emissive: emissive});
    const planeMaterialDown = new THREE.MeshPhongMaterial({map: down,emissive: emissive});
    const planeMaterialLeft = new THREE.MeshPhongMaterial({map: left,emissive: emissive});
    const planeMaterialRight = new THREE.MeshPhongMaterial({map: right,emissive: emissive});
    let skyboxGroup = new THREE.Group()

    //Ceate meshes for all sides
    const frontPlane = new THREE.Mesh(planeGeometry1, planeMaterialFront) 
    const backPlane = new THREE.Mesh(planeGeometry1, planeMaterialBack) 
    const upPlane = new THREE.Mesh(planeGeometry3, planeMaterialUp) 
    const downPlane = new THREE.Mesh(planeGeometry3, planeMaterialDown) 
    const leftPlane = new THREE.Mesh(planeGeometry2, planeMaterialLeft) 
    const rightPlane = new THREE.Mesh(planeGeometry2, planeMaterialRight) 

    //Calculates position of each side
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

    // Add to a common mesh
    skyboxGroup.add(frontPlane)
    skyboxGroup.add(backPlane)
    skyboxGroup.add(upPlane)
    skyboxGroup.add(downPlane)
    skyboxGroup.add(leftPlane)
    skyboxGroup.add(rightPlane)

    return skyboxGroup

}

/**
 * Parses Textures
 * @param {*} textures Textures list
 * @returns a dictionary with the textures where the key is the id of the texture
 */
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

            // Personalized mipmaps
            if(value["mipmap0"]) texture.generateMipmaps = false
            for( let i =0; i<= 7;i++){
                if(value["mipmap"+i.toString()]){
                    loadMipmap(texture, i, value["mipmap"+i.toString()])   
                }
            }

        }
        dict[name] = texture;
        return dict;
    }, {});
}

/**
 *  Parse materials
 * @param {*} textures map with all textures
 * @param {*} materials Materials list
 * @returns map with all the materials being the key the id of the material
 */
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
        // Handle texture if needed
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
        // Handle bump texture if needed
        let bumpTexture = textures[value.bumpref];
        if (bumpTexture) {
            bumpTexture.wrapS = THREE.RepeatWrapping;
            bumpTexture.wrapT = THREE.RepeatWrapping;
            bumpTexture.repeat.set(value.texlength_s, value.texlength_t);
            material.bumpMap = bumpTexture;
            material.bumpScale = value.bumpscale !== undefined ? value.bumpscale : 1.0;  // Default bumpscale to 1.0 if not provided
        }
        dict[name] = material;
        return dict;
    }, {});
}

/**
 * Parses all the nodes
 * @param {*} graph  Node information
 * @returns  map with all the nodes being the key the id of the node
 */
export function parseNodes(graph){
    return Object.entries(graph).reduce((dict, [node, value]) => {
     
        let res = parseNodeName(node)

        let name = res.name
        let params = res.params

        if(name !== "rootid"){
            dict[name] = new Node(value, params)
        }
        return dict;
    }, {});

}

/**
 * Parse cameras
 * @param {*} cameras cameras information
 * @returns map with all the cameras being the key the id of the camera
 */
export function parseCameras(cameras){
    return Object.entries(cameras).reduce((dict, [name, value]) => {
        if(name !== "initial"){
            const near = value.near;
            const far = value.far;
            const location = value.location;
            const target = value.target;
            let camera = null
            if(value.type === "orthogonal"){
                const left = value.left;
                const right = value.right;
                const bottom = value.bottom;
                const top = value.top;

                camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
                camera.position.set(location.x, location.y, location.z);
                camera.lookAt(new THREE.Vector3(target.x, target.y, target.z));
            }
            else{
                const angle = value.angle;
                const aspect = window.innerWidth / window.innerHeight;
                camera = new THREE.PerspectiveCamera(angle,aspect , near, far);

            }
            camera.position.set(location.x, location.y, location.z);
            camera.lookAt(new THREE.Vector3(target.x, target.y, target.z));
            dict[name] = camera
        }
        return dict;
    }, {});
}

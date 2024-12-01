import * as THREE from 'three';
import { rgbToHex, degreesToRadians, createPolygon } from './utils.js';
import { MyNurbsBuilder } from '../MyNurbsBuilder.js';

// Map used to map types with corresponding functions
const map = {
    "pointlight": buildPointlight,
    "rectangle": buildRetangle,
    "triangle":buildTriangle,
    "box": buildBox,
    "cylinder": buildCylinder,
    "sphere": buildSphere,
    "nurbs": buildNurbs,
    "spotlight": buildSpotlight,
    "directionallight": buildDirectionalLight,
    "polygon":buildPolygon

}

/**
 * Builds a primirive
 * @param {*} primitive primitive info
 * @param {*} material material used by the mesh
 * @returns a mesh or a light depending on the primitive
 */
export function buildPrimitive(primitive, material){
    const func = map[primitive.type]
    if(func) return func(primitive, material)
    else console.log(primitive["type"] + " not defined yet")
}

/**
 * Builds rectangle primitive
 * @param {*} rectangle rectangle information
 * @param {*} material material to be used
 * @returns rectangle mesh
 */
function buildRetangle(rectangle, material){
    let width = Math.abs(rectangle["xy2"]["x"] - rectangle["xy1"]["x"] )
    let height = Math.abs(rectangle["xy2"]["y"] - rectangle["xy1"]["y"] )
    let widthSegments = rectangle["parts_x"] ? rectangle["parts_x"] : 1 
    let heightSegments = rectangle["parts_y"] ? rectangle["parts_y"] : 1 
    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    const rectangleMesh = new THREE.Mesh(geometry, material);
    return rectangleMesh
}

/**
 * Creates a Pointlight 
 * @param {*} pointlight pointlight information
 * @param {*} material material in this will not be used
 * @returns Pointlight
 */
function buildPointlight(pointlight, material){
    // Base information
    const enabled = pointlight.enabled ?? true;
    const color = rgbToHex(pointlight.color);
    const intensity = pointlight.intensity ?? 1.0;
    const distance = pointlight.distance ?? 1000;
    const decay = pointlight.decay ?? 2;
    const position = pointlight.position ;
    const castShadow = pointlight.castshadow ?? false ;
    const shadowFar = pointlight.shadowfar ?? 500.0;
    const shadowMapSize = pointlight.shadowmapsize ?? 512;
    
    if (enabled) {
        const pointLight = new THREE.PointLight(color, intensity, distance, decay);
        pointLight.position.set(position.x, position.y, position.z);
        pointLight.castShadow = castShadow;
    
        if (castShadow) {
            pointLight.shadow.camera.far = shadowFar;
            pointLight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
        }
        // If lightHelpers is true in the interface
        if(pointlight.lightHelpers){
            const group = new THREE.Group()
            group.add(pointLight)
            group.add(new THREE.PointLightHelper(pointLight,5))
            return group
        }
        else return pointLight
    }
    return null
}

/**
 * Builds Triangle primitive
 * @param {*} triangle Triangle information
 * @param {*} material material to be used
 * @returns Triangle mesh
 */
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

/**
 * Builds box primitive
 * @param {*} box box information
 * @param {*} material material to be used
 * @returns box mesh
 */
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

/**
 * Builds cylinder primitive
 * @param {*} cylinder cylinder information
 * @param {*} material material to be used
 * @returns cylinder mesh
 */
function buildCylinder(cylinder, material){
 
    const geometry = new THREE.CylinderGeometry(
        cylinder["top"],
        cylinder["base"],
        cylinder["height"],
        cylinder["slices"],
        cylinder["stacks"],
        !(cylinder["capsclose"] ?? false),
        (degreesToRadians(cylinder["thetastart"]) ?? 0),
        (degreesToRadians(cylinder["thetalength"]) ?? Math.PI*2)
    );
    const cylinderMesh = new THREE.Mesh(geometry, material);

    return cylinderMesh

}

/**
 * Builds sphere primitive
 * @param {*} sphere sphere information
 * @param {*} material material to be used
 * @returns sphere mesh
 */
function buildSphere(sphere, material){

    const geometry = new THREE.SphereGeometry(
        sphere["radius"],
        sphere["slices"],
        sphere["stacks"],
        (degreesToRadians(sphere["phistart"]) ?? 0),
        (degreesToRadians(sphere["philength"]) ?? Math.PI*2),
        (degreesToRadians(sphere["thetastart"]) ?? 0),
        (degreesToRadians(sphere["thetalength"]) ?? Math.PI*2),
    );
    
    const sphereMesh = new THREE.Mesh(geometry, material);

    return sphereMesh

}

/**
 * Builds nurbs primitive
 * @param {*} nurbs nurbs information
 * @param {*} material material to be used
 * @returns nurbs mesh
 */
function buildNurbs(nurbs, material){
    let controlPoints= [];
    let surfaceData;

    const samplesU = nurbs["parts_u"]
    const samplesV = nurbs["parts_v"]
    const orderU = nurbs["degree_u"]
    const orderV = nurbs["degree_v"]

    const builder = new MyNurbsBuilder()

    // Converts from {x,y,z} to [x,y,z] format
    for(let u = 0; u<=orderU;u++){
        let aux = []
        for (let v = 0; v <= orderV; v++){
            let point =nurbs["controlpoints"][u*orderV + v]
            aux.push([point["x"], point["y"], point["z"],1])
        }
        controlPoints.push(aux)
    }

    // Builds nurbs with MyNurbsBuilder help from last project
    surfaceData = builder.build(controlPoints,
                orderU, orderV, samplesU,
                samplesV, material)  
    const mesh = new THREE.Mesh( surfaceData, material );
    return mesh
}

/**
 * Creates spotLight
 * @param {*} spotLight spotLight information
 * @param {*} material material will not be used
 * @returns spotLight
 */
function buildSpotlight(spotLight,material ){
    //base information
    const enabled = spotLight.enabled ?? true;
    const color = rgbToHex(spotLight.color);
    const intensity = spotLight.intensity ?? 1;
    const distance = spotLight.distance ?? 1000;
    const angle = spotLight.angle;
    const decay = spotLight.decay ?? 2;
    const penumbra = spotLight.penumbra ?? 1;
    const position = spotLight.position;
    const target = spotLight.target;
    const castShadow = spotLight.castshadow ?? false;
    const shadowFar = spotLight.shadowfar ?? 500;
    const shadowMapSize = spotLight.shadowmapsize ?? 512;

    if (enabled) {
        const spotlight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
        spotlight.position.set(position.x, position.y, position.z);
        spotlight.castShadow = castShadow;
        spotlight.shadow.camera.far = shadowFar;
        spotlight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    
        const targetobject = new THREE.Object3D();
        targetobject.position.set(target.x, target.y, target.z);
        spotlight.target = targetobject;

        // If lightHelpers is true in the interface
        if(spotLight.lightHelpers){
            const group = new THREE.Group()
            group.add(spotlight)
            group.add(new THREE.SpotLightHelper(spotlight))
            return group
        }
        return spotlight
    }
    return null
}

/**
 * Creates directional light 
 * @param {*} directionallight directional light information
 * @param {*} directionallight material to be used
 * @returns directional light 
 */
function buildDirectionalLight(directionallight,material ){
    //Base information
    const enabled = directionallight.enabled ?? true;
    const color = rgbToHex(directionallight.color);
    const intensity = directionallight.intensity ?? 1;
    const position = directionallight.position;
    const castShadow = directionallight.castshadow ?? false;
    const shadowLeft = directionallight.shadowleft ?? -5;
    const shadowRight = directionallight.shadowright ?? 5;
    const shadowBottom = directionallight.shadowbottom ?? -5;
    const shadowTop = directionallight.shadowtop ?? 5;
    const shadowFar = directionallight.shadowfar ?? 500.0;
    const shadowMapSize = directionallight.shadowmapsize ?? 512;
    
    if (enabled) {
        const directionalLight = new THREE.DirectionalLight(color, intensity);
        directionalLight.position.set(position.x, position.y, position.z);
        directionalLight.castShadow = castShadow;
    
        if (castShadow) {
            directionalLight.shadow.camera.left = shadowLeft;
            directionalLight.shadow.camera.right = shadowRight;
            directionalLight.shadow.camera.bottom = shadowBottom;
            directionalLight.shadow.camera.top = shadowTop;
            directionalLight.shadow.camera.far = shadowFar;
            directionalLight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
        }
        // If lightHelpers is true in the interface
        if(directionallight.lightHelpers){
            const group = new THREE.Group()
            group.add(directionalLight)
            group.add(new THREE.DirectionalLightHelper(directionalLight, 10))
            return group
        }
    
        return directionalLight
    }
    return null
}

/**
 * Builds polygon primitive
 * @param {*} rectangle polygon information
 * @param {*} material material to be used
 * @returns polygon mesh
 */
function buildPolygon(polygon,material ){
    //Base information
    const radius = polygon.radius;
    const stacks = polygon.stacks;
    const slices = polygon.slices;
    const color_c = rgbToHex(polygon.color_c);
    const color_p = rgbToHex(polygon.color_p); 

    const polygonGeometry = createPolygon(radius, stacks, slices, color_c, color_p); // Creates polygon with help of auxiliar function
    if(material)
        material = new THREE.MeshBasicMaterial({ vertexColors: true, wireframe: material.wireframe });
    else 
        material = new THREE.MeshBasicMaterial({ vertexColors: true, wireframe: false });
    const polygonMesh = new THREE.Mesh(polygonGeometry, material);
    return polygonMesh
}

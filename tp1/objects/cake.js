import * as THREE from 'three';
import { Candle } from './candle.js';

export class Cake{
    /**
     * 
     * @param {*} scene 
     * @param {*} slices Number of slices the cake is composed by [1-10]
     * @param {*} position Position of the cake
     * @param {*} angle Angle that the cake will rotate in y
     * @param {*} color Color of the cake object
     */
    constructor(scene, slices , position, angle=0, color = '#5C4033') {
        this.scene = scene;
        this.color = color;
        this.position = position;
        this.cakeGroup = new THREE.Group()
        this.angle = angle
        this.slices = slices
        this.init()

    }
    /**
     * Initializes the Cake object
     */
    init(){

        let interiorTexture = new THREE.TextureLoader().load('textures/interior_cake.jpg');
        interiorTexture.wrapS = THREE.MirroredRepeatWrapping;
        interiorTexture.wrapT = THREE.MirroredRepeatWrapping;
        interiorTexture.repeat.set( 2, 2 );

        let exteriorTexture = new THREE.TextureLoader().load('textures/exterior_cake.jpg');
        exteriorTexture.wrapS = THREE.MirroredRepeatWrapping;
        exteriorTexture.wrapT = THREE.MirroredRepeatWrapping;
        exteriorTexture.repeat.set( 2, 2 );

        this.cakeInteriorMaterial = new THREE.MeshLambertMaterial({
            map: interiorTexture
        })

        this.cakeExteriorMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            specular: "#000000",
            shininess: 90,
            map: exteriorTexture
        })
        
        this.cake();
        this.candles();
        this.cakeGroup.rotateY(this.angle)
        this.cakeGroup.position.add(new THREE.Vector3(0,0.75,0))
        this.cakeGroup.position.add(this.position)
    
    }
    /**
     * Creates cake mesh
     */
    cake(){

        const slice_ang = (Math.PI * 2 * 0.1*this.slices)
        let cake = new THREE.CylinderGeometry(1.5, 1.5, 1, 32, 32, false, 0, slice_ang );
        let interior = new THREE.PlaneGeometry( 1.5,1 ); // left 
        let interior2 = new THREE.PlaneGeometry( 1.5,1 ); // right 

        let cakeMesh = new THREE.Mesh(cake, this.cakeExteriorMaterial);
        let interiorMesh = new THREE.Mesh(interior, this.cakeInteriorMaterial);
        let interiorMesh2 = new THREE.Mesh(interior2, this.cakeInteriorMaterial);

        interiorMesh.rotateY(-Math.PI/2)
        interiorMesh.position.add( new THREE.Vector3(0,0,0.75))

        let ang = Math.PI/2 + slice_ang
        interiorMesh2.rotateY(ang)
        interiorMesh2.position.add( new THREE.Vector3(0.75*Math.sin(slice_ang),0,0.75*Math.cos(slice_ang)))
    

        cakeMesh.receiveShadow = cakeMesh.castShadow = true;
        interiorMesh.receiveShadow = interiorMesh.castShadow = true;
        interiorMesh2.receiveShadow = interiorMesh.castShadow = true;

        this.cakeGroup.add (cakeMesh);
        this.cakeGroup.add (interiorMesh2);
        this.cakeGroup.add (interiorMesh);
  
    }
    /**
     * Adds candles to the cake
     */
    candles(){
        const y = 0.75 ; // candle y position
        const init_angle = (Math.PI * 2 * 0.1)/2
        const slice_angle =  (Math.PI * 2 * 0.1)
        for(let i =0; i< this.slices; i++){
            let candle_angle = init_angle + i*slice_angle
            let candle = new Candle(this.scene, new THREE.Vector3(0.75*Math.sin(candle_angle),y,0.75*Math.cos(candle_angle)))
            this.cakeGroup.add( candle.getMesh())
        }

    }

    /**
    * Enables the cake object in the scene
    */
    enable(){
        this.scene.add(this.cakeGroup)
     
    }
    /**
    * Enables the cake object in the scene
    */
    disable(){
        this.scene.remove(this.cakeGroup)
    }

}
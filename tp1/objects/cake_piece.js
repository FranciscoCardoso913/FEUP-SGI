import * as THREE from 'three';
import { Candle } from './candle.js';

export class CakePiece{

    constructor(app, position, angle=0, color = '#5C4033') {
        this.app = app;
        this.color = color;
        this.position = position;
        this.cakeGroup = new THREE.Group()
        this.angle = angle
        this.init()
    }

    /**
     * Initializes the cake object and group
     */
    init(){
        this.cake();
        let y = 1.5 ;
        
        this.cakeGroup.add(this.cakeMesh)
        this.cakeGroup.add(new Candle(this.app, new THREE.Vector3(0.3,y,0.8)).getMesh())
        this.cakeGroup.rotateY(this.angle)
        this.cakeGroup.position.add(this.position)
    
    }

    /**
     * Creates a mesh representing the cake
     */
    cake(){

        // Cake is 
        let interiorTexture = new THREE.TextureLoader().load('textures/interior_cake.jpg');
        interiorTexture.wrapS = THREE.MirroredRepeatWrapping;
        interiorTexture.wrapT = THREE.MirroredRepeatWrapping;
        interiorTexture.repeat.set( 2, 2 );

        let exteriorTexture = new THREE.TextureLoader().load('textures/exterior_cake.jpg');
        exteriorTexture.wrapS = THREE.MirroredRepeatWrapping;
        exteriorTexture.wrapT = THREE.MirroredRepeatWrapping;
        exteriorTexture.repeat.set( 2, 2 );



        let cakeInteriorMaterial = new THREE.MeshLambertMaterial({
            map: interiorTexture
        })

        let cakeExteriorMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            specular: "#000000",
            shininess: 90,
            map: exteriorTexture
        })


        let cake = new THREE.CylinderGeometry(1.5, 1.5, 1, 32, 32, false, 0, (Math.PI * 2 * 0.1));
        let interior = new THREE.PlaneGeometry( 1.5,1 ); // left 
        let interior2 = new THREE.PlaneGeometry( 1.5,1 ); // right 

        this.cakeMesh = new THREE.Mesh(cake, cakeExteriorMaterial);
        let interiorMesh = new THREE.Mesh(interior, cakeInteriorMaterial);
        let interiorMesh2 = new THREE.Mesh(interior2, cakeInteriorMaterial);

        this.cakeMesh.position.set(0, 0.7, 0)

        interiorMesh.position.z = +0.75;
        interiorMesh.rotation.y = -Math.PI/2;

        interiorMesh2.position.z = 0.75*Math.cos(Math.PI/5);
        interiorMesh2.position.x = 0.75*Math.sin(Math.PI/5);
        interiorMesh2.rotation.y = Math.PI/2 + Math.PI*2/10;

        this.cakeMesh.receiveShadow = this.cakeMesh.castShadow = true;
        interiorMesh.receiveShadow = interiorMesh.castShadow = true;
        interiorMesh2.receiveShadow = interiorMesh.castShadow = true;

        this.cakeMesh.add (interiorMesh);
        this.cakeMesh.add (interiorMesh2);
  
    }
    enable(){
        this.app.scene.add(this.cakeGroup)
     
    }
    disable(){
        this.app.scene.remove(this.cakeGroup)
    }

}
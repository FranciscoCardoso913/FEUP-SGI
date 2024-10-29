import * as THREE from 'three';
import { Candle } from './candle.js';

export class Cake{
    constructor(app, position, angle=0, color = '#5C4033') {
        this.app = app;
        this.color = color;
        this.position = position;
        this.cakeGroup = new THREE.Group()
        this.angle = angle
        this.init()
    }
    init(){
        this.cake();
        let y = 1.5 + this.position.y;
        
        this.cakeGroup.add(this.cakeMesh)
        this.cakeGroup.add(new Candle(this.app, new THREE.Vector3(0.2,y,-0.7)).getMesh())
        this.cakeGroup.add(new Candle(this.app, new THREE.Vector3(0.8,y,0.4)).getMesh())
        this.cakeGroup.add(new Candle(this.app, new THREE.Vector3(-0.7,y,-0.5)).getMesh())
        this.cakeGroup.add(new Candle(this.app, new THREE.Vector3(0.5,y,-0.3)).getMesh())
        this.cakeGroup.add(new Candle(this.app, new THREE.Vector3(-0.8,y,0.6)).getMesh())
        this.cakeGroup.rotateY(this.angle)
    
    }
    cake(){

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


        let cake = new THREE.CylinderGeometry(1.5, 1.5, 1, 32, 32, false, 0, (Math.PI * 2 * 0.9));
        let interior = new THREE.PlaneGeometry( 1.5,1 ); // left 
        let interior2 = new THREE.PlaneGeometry( 1.5,1 ); // right 

        this.cakeMesh = new THREE.Mesh(cake, cakeExteriorMaterial);
        let interiorMesh = new THREE.Mesh(interior, cakeInteriorMaterial);
        let interiorMesh2 = new THREE.Mesh(interior2, cakeInteriorMaterial);

        this.cakeMesh.position.set(this.position.x, this.position.y +0.7, this.position.z)

        interiorMesh.position.z = this.position.z+0.60;
        interiorMesh.position.x = this.position.x  -0.45;
        interiorMesh.rotation.y = Math.PI/2 -(Math.PI*2)/9  +0.075  ;

        interiorMesh2.position.z = this.position.z+0.75;
        interiorMesh2.position.x = this.position.x;
        interiorMesh2.rotation.y = 3*Math.PI/2  ;
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
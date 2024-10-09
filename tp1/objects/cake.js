import * as THREE from 'three';
import { Candle } from './candle.js';

export class Cake{
    constructor(app, position, color = '#5C4033') {
        this.app = app;
        this.color = color;
        this.position = position;
        this.init()
    }
    init(){
        this.cake();
        new Candle(this.app, new THREE.Vector3(0.2,1.8,-0.7))
        new Candle(this.app, new THREE.Vector3(0.8,1.8,0.4))
        new Candle(this.app, new THREE.Vector3(-0.7,1.8,-0.5))
        new Candle(this.app, new THREE.Vector3(0.5,1.8,-0.3))
        new Candle(this.app, new THREE.Vector3(-0.8,1.8,0.6))
    }
    cake(){
        let cakeMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })


        let cake = new THREE.CylinderGeometry(1.5, 1.5, 1, 32, 32, false, 0, (Math.PI * 2 * 0.9));
        let interior = new THREE.PlaneGeometry( 1.5,1 ); // left 
        let interior2 = new THREE.PlaneGeometry( 1.5,1 ); // right 

        let cakeMesh = new THREE.Mesh(cake, cakeMaterial);
        let interiorMesh = new THREE.Mesh(interior, cakeMaterial);
        let interiorMesh2 = new THREE.Mesh(interior2, cakeMaterial);

        cakeMesh.position.set(this.position.x, this.position.y, this.position.z)

        interiorMesh.position.y = 1;
        interiorMesh.position.z = 0.60;
        interiorMesh.position.x = -0.45;
        interiorMesh.rotation.y = Math.PI/2 -(Math.PI*2)/9  +0.075  ;

        interiorMesh2.position.y = 1;
        interiorMesh2.position.z = 0.75;
        interiorMesh2.position.x = 0;
        interiorMesh2.rotation.y = 3*Math.PI/2  ;
        
        

        this.app.scene.add(cakeMesh);
        this.app.scene.add(interiorMesh);
        this.app.scene.add(interiorMesh2);
    }

}
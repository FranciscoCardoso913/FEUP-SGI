import * as THREE from 'three';

export class Candle {

    constructor(app, position, color = '#A020F0') {
        this.app = app;
        this.color = color;
        this.position = position;
        this.height = 0.7
        this.init()
    }
    init(){
        this.candle();
        this.fire();
    
    }

    candle(){
        let candleMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        let candle = new THREE.CylinderGeometry(0.1, 0.1, this.height, 10, 5);
        this.candleMesh = new THREE.Mesh(candle, candleMaterial);
        this.candleMesh.position.set(this.position.x, this.position.y , this.position.z)

        //this.app.scene.add(this.candleMesh);
    }
    fire(){
        let sphereMaterial = new THREE.MeshPhongMaterial({
            color: "#FF0000",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })
        let coneMaterial = new THREE.MeshPhongMaterial({
            color: "#FF7700",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        let cone = new THREE.ConeGeometry(0.1,0.2,10,5,false,0,Math.PI *2);
        this.coneMesh = new THREE.Mesh(cone, coneMaterial);
        this.coneMesh.position.set(this.position.x, this.position.y + this.height -0.1  , this.position.z)

        let sphere = new THREE.SphereGeometry(0.1, 10, 10, 0, Math.PI * 2  , 0, Math.PI*0.5);
        this.sphereMesh = new THREE.Mesh(sphere, sphereMaterial); 
        this.sphereMesh.position.set(this.position.x, this.position.y + this.height -0.2  , this.position.z)
        this.sphereMesh.rotation.x = Math.PI
        //this.app.scene.add(this.sphereMesh);

        //this.app.scene.add(this.coneMesh);
    }
    enable(){
        this.app.scene.add(this.sphereMesh)
        this.app.scene.add(this.coneMesh)
        this.app.scene.add(this.candleMesh)
    }
    disable(){
        this.app.scene.remove(this.sphereMesh)
        this.app.scene.remove(this.coneMesh)
        this.app.scene.remove(this.candleMesh)
    }
}
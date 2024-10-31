import * as THREE from 'three';

export class Candle {

    constructor(app, position, color = '#A020F0') {
        this.app = app;
        this.color = color;
        this.position = position;
        this.height = 0.7
        this.candleGroup = new THREE.Group()
        this.init()
    }
    init(){
        this.candle();
        this.fire();
        this.candleGroup.add(this.candleMesh)
        this.candleGroup.add(this.coneMesh)
        this.candleGroup.add(this.sphereMesh)
        this.candleGroup.add(this.light())
    }

    light(){
        const light = new THREE.PointLight(0xFF7700,5, 10)
        light.position.set(this.position.x, this.position.y + this.height -0.2  , this.position.z)
        return light
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
        this.candleMesh.castShadow = this.candleMesh.receiveShadow = true;
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
        this.coneMesh.castShadow = this.coneMesh.receiveShadow = true;
        this.coneMesh.position.set(this.position.x, this.position.y + this.height -0.1  , this.position.z)

        let sphere = new THREE.SphereGeometry(0.1, 10, 10, 0, Math.PI * 2  , 0, Math.PI*0.5);
        this.sphereMesh = new THREE.Mesh(sphere, sphereMaterial); 
        this.sphereMesh.castShadow = this.sphereMesh.receiveShadow = true;
        this.sphereMesh.position.set(this.position.x, this.position.y + this.height -0.2  , this.position.z)
        this.sphereMesh.rotation.x = Math.PI
        //this.app.scene.add(this.sphereMesh);

        //this.app.scene.add(this.coneMesh);
    }
    enable(){
        this.app.scene.add(this.candleGroup)
    
    }
    disable(){
        this.app.scene.add(this.candleGroup)
    }
    getMesh(){
        return this.candleGroup
    }
}
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

    /**
     * Initializes the candle object and group
     */
    init(){
        this.candle();
        this.fire();
        this.candleGroup.add(this.candleMesh)
        this.candleGroup.add(this.coneMesh)
        this.candleGroup.add(this.sphereMesh)
        this.candleGroup.add(this.light())
    }

    /**
     * @returns {THREE.PointLight} - Returns a point light representing the candle light
     */
    light(){
        const light = new THREE.PointLight(0xFF7700,5, 10)
        light.position.set(this.position.x, this.position.y + this.height -0.2  , this.position.z)
        return light
    }

    /**
     * Creates a mesh representing the candle
     */
    candle(){
        let candleMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            specular: "#000000",
            shininess: 90
        })

        let candle = new THREE.CylinderGeometry(0.1, 0.1, this.height, 10, 5);
        this.candleMesh = new THREE.Mesh(candle, candleMaterial);
        this.candleMesh.castShadow = this.candleMesh.receiveShadow = true;
        this.candleMesh.position.set(this.position.x, this.position.y , this.position.z)
    }

    /**
     * Creates a mesh representing the fire of the candle
     */
    fire(){

        let material = new THREE.MeshPhongMaterial({
            color: "#FF7700",
            specular: "#000000",
            emissive: "#000000", // necessary for the "fire" effect
            shininess: 90
        })

        let cone = new THREE.ConeGeometry(0.1,0.2,10,5,false,0,Math.PI *2);
        this.coneMesh = new THREE.Mesh(cone, material);
        this.coneMesh.castShadow = this.coneMesh.receiveShadow = true;
        this.coneMesh.position.set(this.position.x, this.position.y + this.height -0.1  , this.position.z)

        let sphere = new THREE.SphereGeometry(0.1, 10, 10, 0, Math.PI * 2  , 0, Math.PI*0.5);
        material.color = new THREE.Color("#FF0000"); // change the color to red
        this.sphereMesh = new THREE.Mesh(sphere, material); 
        this.sphereMesh.castShadow = this.sphereMesh.receiveShadow = true;
        this.sphereMesh.position.set(this.position.x, this.position.y + this.height -0.2  , this.position.z)
        this.sphereMesh.rotation.x = Math.PI
        
    }

    /**
     * Enables the candle object in the scene
     */
    enable(){
        this.app.scene.add(this.candleGroup)
    }

    /**
     * Disables the candle object in the scene
     */
    disable(){
        this.app.scene.add(this.candleGroup)
    }

    /**
     * @returns {THREE.Mesh} - Returns the mesh representing the candle
     */
    getMesh(){
        return this.candleGroup
    }
}
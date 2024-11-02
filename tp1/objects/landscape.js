import * as THREE from 'three';

export class Landscape{

    constructor(app, imageTexture, position, rotation) {
        this.app = app;
        this.imageTexture = imageTexture;
        this.position = position;
        this.rotation = rotation;
        this.init();
    }

    init(){

        this.landscapeMaterial = new THREE.MeshPhongMaterial({
            shininess: 1000,
            map: this.imageTexture,
        });

        this.landscape = new THREE.PlaneGeometry(400, 300, 800, 600);

        this.landscapeMesh = new THREE.Mesh(this.landscape, this.landscapeMaterial);
        this.landscapeMesh.position.set(this.position.x, this.position.y, this.position.z);
        this.landscapeMesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

        // add a point light on top of the model
        this.pointLight = new THREE.PointLight( 0xffffff, 400,1000,1 );
        this.pointLight.position.set( this.position.x - 100, this.position.y+80, this.position.z );
        this.pointLight.castShadow = true;
        this.pointLight.shadow.mapSize.width = 8192;
        this.pointLight.shadow.mapSize.height = 8192;

        // add a point light helper for the previous point light
        let sphereSize = 10;
        this.pointLightHelper = new THREE.PointLightHelper( this.pointLight, sphereSize );


    }

    enable() {
        this.app.scene.add(this.landscapeMesh);
        this.app.scene.add( this.pointLight );
        this.app.scene.add( this.pointLightHelper );
    }

    disable() {
        this.app.scene.remove(this.landscapeMesh);
        this.app.scene.remove( this.pointLight );
        this.app.scene.remove( this.pointLightHelper );
    }

    

}
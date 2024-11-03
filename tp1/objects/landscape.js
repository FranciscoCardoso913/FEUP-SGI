import * as THREE from 'three';

export class Landscape{
    /**
     * 
     * @param {*} scene 
     * @param {THREE.Texture} imageTexture texture of the landscape
     * @param {THREE.Vector3} position position of the landscape
     * @param {THREE.Vector3} rotation rotation of the landscape
     */
    constructor(scene, imageTexture, position, rotation) {
        this.scene = scene;
        this.imageTexture = imageTexture;
        this.position = position;
        this.rotation = rotation;
        this.landscapeGroup = new THREE.Group()
        this.init();
    }
    /**
     * Initializes the landscaoe object
     */
    init(){

        this.landscapeMaterial = new THREE.MeshPhongMaterial({
            shininess: 1000,
            map: this.imageTexture,
        });

        this.landscape = new THREE.PlaneGeometry(240, 180, 800, 600);

        this.landscapeMesh = new THREE.Mesh(this.landscape, this.landscapeMaterial);
        this.landscapeMesh.position.set(this.position.x, this.position.y, this.position.z);
        this.landscapeMesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

        // add a point light on top of the model
        this.pointLight = new THREE.PointLight( 0xffffff, 400,1000,1 );
        this.pointLight.position.set( this.position.x - 50, this.position.y+80, this.position.z );
        this.pointLight.castShadow = true;
        this.pointLight.shadow.mapSize.width = 4096;
        this.pointLight.shadow.mapSize.height = 4096;

        // add a point light helper for the previous point light
        let sphereSize = 10;
        this.pointLightHelper = new THREE.PointLightHelper( this.pointLight, sphereSize );
        this.landscapeGroup.add(this.landscapeMesh)
        this.landscapeGroup.add(this.pointLight)
        this.landscapeGroup.add(this.pointLightHelper)

    }
   /**
    * Enables the landscape object in the scene
    */
    enable() {
        this.scene.add(this.landscapeGroup);
    }
   /**
    * Disables the landscape object in the scene
    */
    disable() {
        this.scene.remove(this.landscapeGroup);
    }


    /**
     * Returns the Light object
     * @returns {THREE.PointLight} the light object
     */
    getLight(){
        return this.pointLight;
    }
    

}
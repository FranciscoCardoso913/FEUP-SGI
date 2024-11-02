import * as THREE from 'three';
export class Lamp {
    /**
     * 
     * @param {*} scene 
     * @param {THREE.Vector3} position position of the lamp
     */
    constructor(scene, position) {
        this.scene = scene;
        this.position = position;
        this.lampGroup = new THREE.Group()
        this.init()
    }

    /**
     * Initializes the lamp object
     */
    init(){
        this.chain();
        this.lamp();
        this.lampGroup.add(this.chainMesh);
        this.lampGroup.add(this.lampMesh);
        this.lampGroup.add(this.light);
    }

    /**
     * Creates the chain object that holds the lamp
     */
    chain(){

        let chainMaterial = new THREE.MeshPhongMaterial({
            color: "#8c8c8c",
            specular: "#ffffff"
        });

        let chain = new THREE.CylinderGeometry(0.5, 0.5, 2, 30, 30, false, 0, Math.PI*2);

        this.chainMesh = new THREE.Mesh(chain, chainMaterial);
        this.chainMesh.position.set(this.position.x, this.position.y + 2, this.position.z);

    }
    /**
     * Creates the lamp object and the lamp light
     */
    lamp(){
        let lampMaterial = new THREE.MeshPhongMaterial({
            color: "#bb9469",
            specular: "#0f0f0f",
            side: THREE.DoubleSide
        });

        // Create lamp object
        let lamp = new THREE.ConeGeometry(2.5, 5, 30, 20, true, 0 , Math.PI*2);
        this.lampMesh = new THREE.Mesh(lamp, lampMaterial);
        this.lampMesh.position.set(this.position.x, this.position.y, this.position.z);

        // Create light
        this.light = new THREE.SpotLight(0xffffff, 80, 50, Math.PI/4, 0.3, 1);
        this.light.position.set(this.position.x, this.position.y, this.position.z);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 8192;
        this.light.shadow.mapSize.height = 8192;
        this.light.target.position.set(0,0,0);


    }
   /**
    * Enables the lamp object in the scene
    */
    enable(){
        this.scene.add(this.lampGroup);
    }
   /**
    * Disables the lamp object in the scene
    */
    disable(){
        this.scene.remove(this.lampGroup);
    }

}
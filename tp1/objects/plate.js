import * as THREE from 'three';

export class Plate {
    /**
     * 
     * @param {*} scene 
     * @param {*} position Position of the plate
     * @param {*} radius radius of the plate
     * @param {*} color color of the plate
     */
    constructor(scene, position,radius = 1.8, color = '#ffffff') {
        this.scene = scene;
        this.color = color;
        this.position = position;
        this.radius = radius
        this.init()
    }
    /**
     * Initialize the plate
     */
    init(){
        this.plate()
    }
    /**
     * Creates plate object
     */
    plate(){
                
        const map =new THREE.TextureLoader().load( 'textures/plate.jpg' );
        map.colorSpace = THREE.SRGBColorSpace;

        let cylinderMaterial = new THREE.MeshLambertMaterial( { map: map,color: 0xaaaaaa} );

        let cylinder = new THREE.CylinderGeometry(this.radius, this.radius*5/6, 0.1, 15,15);
        this.cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);
        this.cylinderMesh.castShadow = this.cylinderMesh.receiveShadow = true;
        this.cylinderMesh.position.set(this.position.x, this.position.y + 0.05, this.position.z)

    }
    /**
    * Enables the plate object in the scene
    */
    enable(){
        this.scene.add(this.cylinderMesh)
    }
    /**
    * Disables the plate object in the scene
    */
    disable(){
        this.scene.remove(this.cylinderMesh)
    }
}
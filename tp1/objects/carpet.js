import * as THREE from 'three';

export class Carpet{

    constructor(scene ,width=10,height=15,position = new THREE.Vector3(0,0,0)) {
        this.scene = scene
        this.width=width
        this.height=height
        this.position = position
        this.init()
    }

    /**
     * Initializes the carpet object
     */
    init() {
        const geometry = new THREE.PlaneGeometry(this.width,this.height,5,5)
        let map =new THREE.TextureLoader().load( 'textures/carpet.jpg' );
        map.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.MeshLambertMaterial( { map: map, color:0x777777} );
        this.carpet = new THREE.Mesh(geometry, material);
        this.carpet.receiveShadow = true;
        this.carpet.position.add(this.position)
        this.carpet.rotateX(-Math.PI/2)

    }

    /**
     * Adds the carpet to the scene
     */
    enable(){
        this.scene.add(this.carpet)
    }
    
    /**
     * Removes the carpet from the scene
     */
    disable(){
        this.scene.remove(this.carpet)
    }
}
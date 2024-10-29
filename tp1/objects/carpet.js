import * as THREE from 'three';

export class Carpet{

    constructor(scene ,width=10,height=15,position = new THREE.Vector3(0,0,0)) {
        this.scene = scene
        this.width=width
        this.height=height
        this.position = position

        this.init()
    }

    init() {
        const geometry = new THREE.PlaneGeometry(this.width,this.height,5,5)
        let map =new THREE.TextureLoader().load( 'textures/carpet.jpg' );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        map.anisotropy = 4;

        map.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.MeshLambertMaterial( { map: map, color:0x777777} );
        this.carpet = new THREE.Mesh(geometry, material)
        this.carpet.position.add(this.position)
        this.carpet.rotateX(-Math.PI/2)

    }

    enable(){
        this.scene.add(this.carpet)
    }
    
    disable(){
        this.scene.remove(this.carpet)
    }
}
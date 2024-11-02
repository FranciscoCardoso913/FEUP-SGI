import * as THREE from 'three';

export class Door{

    constructor(scene ,position = new THREE.Vector3(0,0,0),width=5,height=12) {
        this.scene = scene
        this.width=width
        this.height=height
        this.position = position

        this.init()
    }

    init() {
        const geometry = new THREE.PlaneGeometry(this.width,this.height,5,5)
        let map =new THREE.TextureLoader().load( 'textures/door.jpg' );
        map.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.MeshLambertMaterial( { map: map, color:0xfebc99} );
        this.door = new THREE.Mesh(geometry, material)
        this.door.position.add(new THREE.Vector3(0, this.height/2, 0))
        this.door.position.add(this.position)
        this.door.rotateY(Math.PI/2)

    }

    enable(){
        this.scene.add(this.door)
    }
    
    disable(){
        this.scene.remove(this.door)
    }
}
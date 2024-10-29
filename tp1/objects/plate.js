import * as THREE from 'three';

export class Plate {
    constructor(app, position,radius = 1.8, color = '#ffffff') {
        this.app = app;
        this.color = color;
        this.position = position;
        this.radius = radius
        this.init()
    }
    init(){
        this.plate()
    }

    plate(){
                
        const map =new THREE.TextureLoader().load( 'textures/plate.jpg' );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        map.colorSpace = THREE.SRGBColorSpace;

        let cylinderMaterial = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide,color: 0xaaaaaa} );

        let cylinder = new THREE.CylinderGeometry(this.radius, this.radius*5/6, 0.1, 15,15);
        this.cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);
        this.cylinderMesh.position.set(this.position.x, this.position.y + 0.05, this.position.z)

    }

    enable(){
        this.app.scene.add(this.cylinderMesh)
    }
    
    disable(){
        this.app.scene.remove(this.cylinderMesh)
    }
}
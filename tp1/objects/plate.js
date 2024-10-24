import * as THREE from 'three';

export class Plate {
    constructor(app, position, color = '#ffffff') {
        this.app = app;
        this.color = color;
        this.position = position;
        this.init()
    }
    init(){
        this.plate()
    }

    plate(){
                
        let cylinderMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        let cylinder = new THREE.CylinderGeometry(1.8, 1.5, 0.1, 15,15);
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
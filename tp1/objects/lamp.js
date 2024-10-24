import * as THREE from 'three';
export class Lamp {

    constructor(app, position) {
        this.app = app;
        this.position = position;
        this.init()
    }
    init(){
        this.chain();
        this.lamp();
    }

    chain(){

        let chainMaterial = new THREE.MeshPhongMaterial({
            color: "#8c8c8c",
            specular: "#ffffff"
        });

        let chain = new THREE.CylinderGeometry(0.5, 0.5, 2, 30, 30, false, 0, Math.PI*2);

        this.chainMesh = new THREE.Mesh(chain, chainMaterial);

        this.chainMesh.position.set(this.position.x, this.position.y + 2, this.position.z);

    }

    lamp(){
        let lampMaterial = new THREE.MeshPhongMaterial({
            color: "#bb9469",
            specular: "#0f0f0f",
            side: THREE.DoubleSide
        });


        let lamp = new THREE.ConeGeometry(2.5, 5, 30, 20, true, 0 , Math.PI*2);

        this.lampMesh = new THREE.Mesh(lamp, lampMaterial);
        this.lampMesh.position.set(this.position.x, this.position.y, this.position.z);

        this.light = new THREE.SpotLight(0xffffff, 80, 50, Math.PI/4, 1, 1);
        this.light.position.set(this.position.x, this.position.y, this.position.z);
        this.light.target.position.set(0,0,0);


    }

    enable(){
        this.app.scene.add(this.chainMesh);
        this.app.scene.add(this.lampMesh);
        this.app.scene.add(this.light);

    }

    disable(){
        this.app.scene.remove(this.chainMesh);
        this.app.scene.remove(this.lampMesh);
        this.app.scene.remove(this.light);
        
    }

}
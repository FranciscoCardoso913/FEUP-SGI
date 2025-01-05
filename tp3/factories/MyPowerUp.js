import * as THREE from 'three';

class MyPowerUp  {

    constructor(position) {
        this.position = position
        this.powerup = this.build()
        this.rotationChange = 0.01
    }

    build(){

        let extmaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, opacity: 0.5, transparent: true });
        let intmaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false });
        let geometry1 = new THREE.BoxGeometry(1, 1, 1);
        let geometry2 = new THREE.BoxGeometry(1, 1, 1);
        let insideGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        this.box1 = new THREE.Mesh(geometry1, extmaterial);
        this.box2 = new THREE.Mesh(geometry2, extmaterial);
        this.insideBox = new THREE.Mesh(insideGeometry, intmaterial);

        this.box1.rotateX(47*Math.PI/180);
        this.box1.rotateY(47*Math.PI/180);
        this.box1.rotateZ(47*Math.PI/180);

        this.box2.rotateX(-44*Math.PI/180);
        this.box2.rotateY(-44*Math.PI/180);
        this.box2.rotateZ(-44*Math.PI/180);

        let group = new THREE.Group();
        group.add(this.box1);
        group.add(this.box2);
        group.add(this.insideBox);

        group.position.set(this.position.x, this.position.y, this.position.z);

        return group;
    }

    updatePowerUp(){

        this.box1.rotation.x -= this.rotationChange
        this.box1.rotation.y -= this.rotationChange
        this.box1.rotation.z -= this.rotationChange

        this.box2.rotation.x += this.rotationChange
        this.box2.rotation.y += this.rotationChange
        this.box2.rotation.z += this.rotationChange

        this.insideBox.rotation.y += this.rotationChange

    }

}

export { MyPowerUp };

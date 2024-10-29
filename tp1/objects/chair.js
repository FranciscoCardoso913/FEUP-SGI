import * as THREE from 'three';

export class Chair{

    constructor(scene, position = new THREE.Vector3(0,0,0) , angle = 0) {
        this.scene = scene
        this.position = position
        this.angle = angle
        this.chair = new THREE.Group();
        this.init()
    }

    init() {
        let map =new THREE.TextureLoader().load( 'textures/dark_wood.jpg' );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        map.anisotropy = 16;

        map.colorSpace = THREE.SRGBColorSpace;

        this.legMaterial = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide} );

        map =new THREE.TextureLoader().load( 'textures/light_wood.jpg' );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        map.anisotropy = 16;

        map.colorSpace = THREE.SRGBColorSpace;

        this.plankMaterial = new THREE.MeshLambertMaterial( { map: map,side: THREE.DoubleSide, color: 0xcccccc});

        this.chair.add(this.drawLeg(new THREE.Vector3(0,2.25,0),4.5))
        this.chair.add(this.drawLeg(new THREE.Vector3(2.5,2.25,0),4.5))
        this.chair.add(this.drawLeg(new THREE.Vector3(0,1.5,2.5)))
        this.chair.add(this.drawLeg(new THREE.Vector3(2.5,1.5,2.5)))
        this.chair.add(this.drawPlank(3,3,new THREE.Vector3(1.25,3,1.25),Math.PI/2))
        this.chair.add(this.drawPlank(3,2,new THREE.Vector3(1.25,5.5,0)))

        this.chair.position.add(this.position)
        this.chair.rotateY(this.angle)
    }

    drawLeg(position, height =3){
        const geometry = new THREE.BoxGeometry(0.3, height, 0.3, 5, 5, 5);

        let leg = new THREE.Mesh(geometry, this.legMaterial);
        leg.position.copy(position)
        return leg
    }

    drawPlank(width, height, position, angle=0){
        const geometry = new THREE.BoxGeometry(width, height, 0.3, 5, 5, 5);
        let plank = new THREE.Mesh(geometry, this.plankMaterial);
        plank.position.copy(position)
        plank.rotateX(angle)
        return plank
    }

    enable(){
        this.scene.add(this.chair)
    }

    disable(){
        this.scene.remove(this.chair)
    }
}
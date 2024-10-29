import * as THREE from 'three';

export class Couch{

    constructor(scene ,position = new THREE.Vector3(0,0,0) , angle = 0) {
        this.scene = scene
    
        this.position = position
        this.angle = angle
        this.chair = new THREE.Group();
        this.init()
    }

    init() {

        let map =new THREE.TextureLoader().load( 'textures/light_wood.jpg' );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        map.anisotropy = 16;

        map.colorSpace = THREE.SRGBColorSpace;

        this.legMaterial = new THREE.MeshLambertMaterial( { map: map,

                    side: THREE.DoubleSide,

                    transparent: true, opacity: 1 } );

        map =new THREE.TextureLoader().load( 'textures/couch.jpg' );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        map.anisotropy = 16;

        map.colorSpace = THREE.SRGBColorSpace;

        this.plankMaterial = new THREE.MeshLambertMaterial( { map: map,

                    side: THREE.DoubleSide,

                    transparent: true, opacity: 1 } ); 

        this.chair.add(this.drawLeg(new THREE.Vector3(-1.5,3*Math.cos(Math.PI/4)/2,-1.5),Math.PI/4, Math.PI/4))
        this.chair.add(this.drawLeg(new THREE.Vector3(-1.5,3*Math.cos(Math.PI/4)/2,1.5),Math.PI/4, 3*Math.PI/4))
        this.chair.add(this.drawLeg(new THREE.Vector3(1.5,3*Math.cos(Math.PI/4)/2,1.5),Math.PI/4, 5*Math.PI/4))
        this.chair.add(this.drawLeg(new THREE.Vector3(1.5,3*Math.cos(Math.PI/4)/2,-1.5),Math.PI/4, 7*Math.PI/4))
        this.chair.add(this.drawPlank(4,4,new THREE.Vector3(0,2.3,0),Math.PI/2))
        this.chair.add(this.drawPlank(4,2,new THREE.Vector3(1.7,3.1,0),0,Math.PI/2,-Math.PI/16))
        this.chair.add(this.drawPlank(4,2,new THREE.Vector3(-2.2,3.1,0),0,Math.PI/2,Math.PI/16))
        this.chair.add(this.drawPlank(4,5,new THREE.Vector3(0,4.8,-2),-Math.PI/16,Math.PI))
        this.chair.position.add(this.position)
        this.chair.rotateY(this.angle)
    }

    drawLeg(position, anglex, angley){
        const geometry = new THREE.CylinderGeometry(
            0.2,     // Radius at the top of the cylinder
            0.2,   // Radius at the bottom of the cylinder
            3,         // Height of the cylinder
            10  // Number of segmented faces around the circumference
        );

        let leg = new THREE.Mesh(geometry, this.legMaterial);
        leg.rotateY(angley)
        leg.rotateX(anglex)
        
        leg.position.copy(position)
        return leg
    }

    drawPlank(width, height, position, anglex = 0, angley = 0, anglez = 0, borderRadius = 0.2) {
        // Define the shape with rounded corners
        const shape = new THREE.Shape();
    
        // Move to the starting point
        shape.moveTo(-width / 2 + borderRadius, -height / 2);
    
        // Draw lines and arcs to create rounded corners
        shape.lineTo(width / 2 - borderRadius, -height / 2);
        shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + borderRadius);
    
        shape.lineTo(width / 2, height / 2 - borderRadius);
        shape.quadraticCurveTo(width / 2, height / 2, width / 2 - borderRadius, height / 2);
    
        shape.lineTo(-width / 2 + borderRadius, height / 2);
        shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - borderRadius);
    
        shape.lineTo(-width / 2, -height / 2 + borderRadius);
        shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + borderRadius, -height / 2);
    
        // Extrude the shape to give it depth
        const extrudeSettings = { depth: 0.5, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
        // Create the plank mesh
        let plank = new THREE.Mesh(geometry, this.plankMaterial);
        plank.position.copy(position);
        plank.rotateX(anglex);
        plank.rotateZ(anglez);
        plank.rotateY(angley);
        
    
        return plank;
    }
    


    enable(){
        this.scene.add(this.chair)
    }
}
import * as THREE from 'three';

export class Couch{

    constructor(scene ,position = new THREE.Vector3(0,0,0) , angle = 0) {
        this.scene = scene
        this.position = position
        this.angle = angle
        this.couch = new THREE.Group();
        this.init()
    }

    /**
     * Initializes the chair object and its materials and its group
     */
    init() {

        let map =new THREE.TextureLoader().load( 'textures/light_wood.jpg' );
        map.colorSpace = THREE.SRGBColorSpace;
        this.legMaterial = new THREE.MeshLambertMaterial( { 
            map: map,
            transparent: true,
        } );

        map =new THREE.TextureLoader().load( 'textures/couch.jpg' );
        this.plankMaterial = new THREE.MeshLambertMaterial( { 
            map: map,
            transparent: true,
        } ); 

        this.couch.add(this.drawLeg(new THREE.Vector3(-1.5,3*Math.cos(Math.PI/4)/2,-1.5),Math.PI/4, Math.PI/4))
        this.couch.add(this.drawLeg(new THREE.Vector3(-1.5,3*Math.cos(Math.PI/4)/2,1.5),Math.PI/4, 3*Math.PI/4))
        this.couch.add(this.drawLeg(new THREE.Vector3(1.5,3*Math.cos(Math.PI/4)/2,1.5),Math.PI/4, 5*Math.PI/4))
        this.couch.add(this.drawLeg(new THREE.Vector3(1.5,3*Math.cos(Math.PI/4)/2,-1.5),Math.PI/4, 7*Math.PI/4))
        this.couch.add(this.drawPlank(4,4,new THREE.Vector3(0,2.3,0),Math.PI/2))
        this.couch.add(this.drawPlank(4,2,new THREE.Vector3(1.7,3.1,0),0,Math.PI/2,-Math.PI/16))
        this.couch.add(this.drawPlank(4,2,new THREE.Vector3(-2.2,3.1,0),0,Math.PI/2,Math.PI/16))
        this.couch.add(this.drawPlank(4,5,new THREE.Vector3(0,4.8,-2),-Math.PI/16,Math.PI))
        this.couch.position.add(this.position)
        this.couch.rotateY(this.angle)
    }

    /**
     * @param {THREE.position} position 
     * @param {number} anglex 
     * @param {number} angley 
     * @returns {THREE.Mesh} Mesh representing the leg at the given position with the given angles
     */
    drawLeg(position, anglex, angley){
        const geometry = new THREE.CylinderGeometry(
            0.2,   // Radius at the top of the cylinder
            0.2,   // Radius at the bottom of the cylinder
            3,     // Height of the cylinder
            10     // Number of segmented faces around the circumference
        );
        let leg = new THREE.Mesh(geometry, this.legMaterial);
        leg.castShadow = leg.receiveShadow = true;
        leg.rotateY(angley)
        leg.rotateX(anglex)
        
        leg.position.copy(position)
        return leg
    }

    /**
     * @param {Number} width 
     * @param {Number} height 
     * @param {THREE.Vector3} position 
     * @param {Number} anglex 
     * @param {Number} angley 
     * @param {Number} anglez 
     * @param {Number} borderRadius 
     * @returns  {THREE.Mesh} Mesh representing the plank at the given position with the given width, height and angles
     */
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
    
        const extrudeSettings = { depth: 0.5, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        // Create the mesh and define attributes
        let plank = new THREE.Mesh(geometry, this.plankMaterial);
        plank.castShadow = plank.receiveShadow = true;
        plank.position.copy(position);
        plank.rotateX(anglex);
        plank.rotateZ(anglez);
        plank.rotateY(angley);
        return plank;
    }
    
    /**
     * Adds the chair to the scene
     */
    enable(){
        this.scene.add(this.couch)
    }

    /**
     * Removes the chair from the scene
     */
    disable(){
        this.scene.remove(this.couch)
    }
}
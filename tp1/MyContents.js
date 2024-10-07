import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess })
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.position.y = this.boxDisplacement.y;
        this.boxMesh.scale.set(1,1,2);
        this.boxMesh.rotation.set(0,0,0);
    }

    buildPlane() {
        let planePrimitiveMaterial = new THREE.MeshPhongMaterial({ color: "#00ffff",
        specular: "#000000", emissive: "#000000", shininess: 90 })

        let planePrimitive = new THREE.PlaneGeometry( 5, 5); 
        this.planePrimitiveMesh = new THREE.Mesh( planePrimitive, planePrimitiveMaterial );
        this.planePrimitiveMesh.rotation.x = -Math.PI / 2;
        this.planePrimitiveMesh.position.y = 3;
        this.planePrimitiveMesh.scale.set(1,1,1);
        this.app.scene.add(this.planePrimitiveMesh);
    }

    buildCircle(thetaMult=1) {
        let circleMaterial = new THREE.MeshPhongMaterial({ color: "#ff00ff",
        specular: "#000000", emissive: "#000000", shininess: 90 })

        let circle = new THREE.CircleGeometry( 2, 32, 0, Math.PI * 2 * thetaMult);
        this.circleMesh = new THREE.Mesh( circle, circleMaterial );
        this.circleMesh.position.y = 4;
        this.circleMesh.rotation.x = -Math.PI / 2;
        
        this.app.scene.add( this.circleMesh );
    }

    buildSphere(thetaMult=1, phiMult=1, position) {
        let shpereMaterial = new THREE.MeshPhongMaterial({
            color: "#07aadd",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        let sphere = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2 * phiMult, 0, Math.PI * thetaMult);
        this.sphereMesh = new THREE.Mesh(sphere, shpereMaterial); 
        this.sphereMesh.position.x = position.x;
        this.sphereMesh.position.y = position.y;
        
        this.app.scene.add(this.sphereMesh);

    }

    buildCylinder(thetaMult=1, position) {
        
        let cylinderMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff00",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        let cylinder = new THREE.CylinderGeometry(2, 2, 3, 32, 32, false, 0, Math.PI * 2 * thetaMult);
        this.cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);
        this.cylinderMesh.position.x = position.x;
        this.cylinderMesh.position.y = position.y;

        this.app.scene.add(this.cylinderMesh);
    }

    buildCone(thetaMult=1, position){
        let coneMaterial = new THREE.MeshPhongMaterial({
            color: "#C58B93",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        let cone = new THREE.ConeGeometry(2,2,32,32,false,0,Math.PI *2 * thetaMult);
        this.coneMesh = new THREE.Mesh(cone, coneMaterial);
        this.coneMesh.position.x = position.x;
        this.coneMesh.position.y = position.y;

        this.app.scene.add(this.coneMesh);
    }

    buildPolyhedron() {
        let polyhedronMaterial = new THREE.MeshPhongMaterial({
            color: "#FFFFFF",
            specular: "#000000",
            emissive: "#FFFFFF",
            shininess: 90
        });
    
        let vertices = [
            1, 1, 1,   // 0
           -1, 1, 1,   // 1
           -1, -1, 1,  // 2
            1, -1, 1,  // 3
            1, 1, -1,  // 4
           -1, 1, -1,  // 5
           -1, -1, -1, // 6
            1, -1, -1  // 7
        ];
    
        let indices = [
            // FRONT
            0, 1, 2,
            0, 2, 3,
    
            // BACK
            4, 6, 5,
            4, 7, 6,
    
            // TOP
            4, 5, 1,
            4, 1, 0,
    
            // BOTTOM
            3, 2, 6,
            3, 6, 7,

            // RIGHT
            4, 0, 3,
            4, 3, 7,
    
            // LEFT
            1, 5, 6,
            1, 6, 2
        ];
    
        let polyhedron = new THREE.PolyhedronGeometry(vertices, indices, 1, 0);
    
        let polyhedronMesh = new THREE.Mesh(polyhedron, polyhedronMaterial);
        polyhedronMesh.position.y = 16; 
        this.app.scene.add(polyhedronMesh);
    }
    

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildBox();
        this.buildPlane();
        this.buildCircle();
        this.buildSphere(1, 1, new THREE.Vector3(2, 5, 0));
        this.buildSphere(0.5, 0.5, new THREE.Vector3(-2, 5, 0));
        this.buildCylinder(1, new THREE.Vector3(-3, 8, 0));
        this.buildCylinder(0.75, new THREE.Vector3(3, 8, 0));
        this.buildCone(1, new THREE.Vector3(2.5,12,0));
        this.buildCone(0.25, new THREE.Vector3(-2.5,12,0));
        this.buildPolyhedron();
        
        
        // Create a Plane Mesh with basic material
        
        let plane = new THREE.PlaneGeometry( 10, 10 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add( this.planeMesh );
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };
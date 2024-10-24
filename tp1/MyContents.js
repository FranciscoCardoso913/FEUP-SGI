import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import {MyPrimitive} from './objects/primitive.js';
import { House } from './objects/house.js';
import { Cake } from './objects/cake.js';
import { Plate } from './objects/plate.js';
import { Table } from './objects/table.js';
import { Frame } from './objects/frame.js';

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
        this.scene3DEnabled = true;

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false;
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // Texture GUI attributes
        this.wrapSName = "Repeat";
        this.wrapTName = "Repeat";
        this.wrapS = THREE.RepeatWrapping;
        this.wrapT = THREE.RepeatWrapping;
        this.repeatU = 1;
        this.repeatV = 1;
        this.offsetU = 0;
        this.offsetV = 0;
        this.rotation = 0;

        // plane related attributes
        this.planeEnabled = false;
        //texture
        this.planeTexture = new THREE.TextureLoader().load('textures/feup_b.jpg');
        this.planeTexture.wrapS = this.wrapS;
        this.planeTexture.wrapT = this.wrapT;
        this.planeTexture.repeat.set(this.repeatU, this.repeatV);
        this.planeTexture.rotation = this.rotation;
        this.planeTexture.offset.set(this.offsetU, this.offsetV);
        //material 
        this.diffusePlaneColor = "rgb(128,0,0)";
        this.specularPlaneColor = "rgb(0,0,0)";
        this.planeShininess = 0;
        //relating texture and material:
        //two alternatives with different results
        //alternative 1
        //this.planeMaterial = new THREE.MeshPhongMaterial({
        //    color: this.diffusePlaneColor,
        //    specular: this.specularPlaneColor,
        //    emissive: "#000000",
        //    shininess: this.planeShininess,
        //    map: this.planeTexture
        //}) //end of alternative 1 

        //alternative 2
        this.planeMaterial = new THREE.MeshLambertMaterial({
            map: this.planeTexture
        }) //end of alternative 2

    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    

        // Box texture
        this.boxTexture = new THREE.TextureLoader().load('textures/feup_entry.jpg');

        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90, map: this.boxTexture });
        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.position.y = this.boxDisplacement.y;
        this.boxMesh.scale.set(1,1,2);
        this.boxMesh.rotation.set(0,0,0);
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

        //Building frames
        this.frameTexture = new THREE.TextureLoader().load('textures/frame.png');
        this.frameTexture.wrapS = THREE.MirroredRepeatWrapping;
        this.frameTexture.wrapT = THREE.MirroredRepeatWrapping;

        this.image1Texture = new THREE.TextureLoader().load('textures/202108793.jpg');
        this.image2Texture = new THREE.TextureLoader().load('textures/202108794.jpg');

        this.frameStudent1 = new Frame(this.app, this.image1Texture, 2, 3, 0.4, "#ce9c69", this.frameTexture, new THREE.Vector3(5, 10, -19.6), new THREE.Vector3(0, 0, 0));
        this.frameStudent2 = new Frame(this.app, this.image2Texture, 2, 3, 0.4, "#ce9c69", this.frameTexture, new THREE.Vector3(-5, 10, -19.6), new THREE.Vector3(0, 0, 0));
    
        this.frameStudent1.enable();
        this.frameStudent2.enable();


        // Constructing the scene
        this.house = new House(this.app, 40, 40, 20);
        this.table = new Table(this.app, 10, 10, 0.5, 4, 0.25, "#ce9c69", "#ce9c69");
        this.cake = new Cake(this.app, new THREE.Vector3(0,4.3,0));
        this.plate = new Plate(this.app, new THREE.Vector3(0,4.5,0));
        this.enableScene3D();

        // Create a Plane Mesh with basic material
        let planeSizeU = 10;
        let planeSizeV = 7;

        var plane = new THREE.PlaneGeometry(planeSizeU, planeSizeV );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial);
        this.planeMesh.rotation.x = - Math.PI / 2;
        this.planeMesh.position.y = 0;
        this.planeEnabled ? this.app.scene.add(this.planeMesh) : null;

    }

    /**
     * updates the Wrapping Mode in the desired axis
     * @param {String} axis 
     */
    updateWrapMode(axis) {

        let mode = axis === 's' ?  this.wrapSName : this.wrapTName;

        if (mode === 'Clamp') {
            axis === 's' ? this.wrapS = THREE.ClampToEdgeWrapping : this.wrapT = THREE.ClampToEdgeWrapping;
        }
        else if (mode === 'Repeat') {
            axis === 's' ? this.wrapS = THREE.RepeatWrapping : this.wrapT = THREE.RepeatWrapping;
        }
        else {
            axis === 's' ? this.wrapS = THREE.MirroredRepeatWrapping : this.wrapT = THREE.MirroredRepeatWrapping;
        }

        this.planeTexture.wrapS = this.wrapS;
        this.planeTexture.wrapT = this.wrapT;

        this.planeTexture.needsUpdate = true;
    }


    /**
     * Updates the texture repeat in the desired axis
     * @param {String} axis 
     * @param {number} value 
     */
    updateRepeat(axis, value) {
        if (axis === 'u') {
            this.repeatU = value;
        }
        else {
            this.repeatV = value;
        }
        this.planeTexture.repeat.set(this.repeatU, this.repeatV);
    }

    /**
     * Updates the texture offset in the desired axis
     * @param {String} axis 
     * @param {number} value 
     */
    updateOffset(axis, value) {
        if (axis === 'u') {
            this.offsetU = value;
        }
        else {
            this.offsetV = value;
        }
        this.planeTexture.offset.set(this.offsetU, this.offsetV);
    }

    /**
     * updates the texture rotation
     * @param {number} value 
     */
    updateRotation(value) {
        this.rotation = value * Math.PI / 180;
        this.planeTexture.rotation = this.rotation;
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

    enablePlane(enable) {
        enable ? this.app.scene.add(this.planeMesh) : this.app.scene.remove(this.planeMesh);
    }
    
    enableScene3D() {
        if (this.scene3DEnabled) {
            this.house.enable();
            this.table.enable();
            this.cake.enable();
            this.plate.enable();
            this.frameStudent1.enable();
            this.frameStudent2.enable();
        }
        else {
            this.house.disable();
            this.table.disable();
            this.cake.disable();
            this.plate.disable();
            this.frameStudent1.disable();
            this.frameStudent2.disable();
        }
    }

    //TODO Fazer esta função para mostrar as primitivas
    enablePrimitives() {
        // Primitives
        // let prim = new MyPrimitive(this.app);
        // prim.buildPlane();
        //this.buildCircle();
        //this.buildSphere(1, 1, new THREE.Vector3(2, 5, 0));
        //this.buildSphere(0.5, 0.5, new THREE.Vector3(-2, 5, 0));
        //this.buildCylinder(1, new THREE.Vector3(-3, 8, 0));
        //this.buildCylinder(0.75, new THREE.Vector3(3, 8, 0));
        //this.buildCone(1, new THREE.Vector3(2.5,12,0));
        //this.buildCone(0.25, new THREE.Vector3(-2.5,12,0));
        //this.buildPolyhedron();
        
        /*
        if (this.primitivesEnabled) {
            this.primitives.enable();
        }
        else {
            this.primitives.disable();
        }*/
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
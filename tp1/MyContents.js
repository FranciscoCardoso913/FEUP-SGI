import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { House } from './objects/house.js';
import { Cake } from './objects/cake.js';
import { Plate } from './objects/plate.js';
import { Table } from './objects/table.js';
import { Frame } from './objects/frame.js';
import { Lamp } from './objects/lamp.js';
import { Landscape } from './objects/landscape.js';
import { Chair } from './objects/chair.js';
import { NewsPaper } from './objects/newspaper.js';
import { Carpet } from './objects/carpet.js';
import { Spring } from './objects/spring.js';
import { Jar } from './objects/jar.js';
import { Couch } from './objects/couch.js';
import { FloorLamp } from './objects/floor_lamp.js';
import { Book } from './objects/book.js';
import { Shelve } from './objects/shelve.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

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

        this.builder = new MyNurbsBuilder()

        //alternative 2
        this.planeMaterial = new THREE.MeshLambertMaterial({
            map: this.planeTexture
        }) //end of alternative 2

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

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

    

        // Constructing the scene
        this.house = new House(this.app, 40, 40, 20);
        this.table = new Table(this.app, 10, 10, 0.5, 4, 0.25, "#ce9c69", "#ce9c69");
        this.cake = new Cake(this.app, new THREE.Vector3(0,4.2,0), Math.PI);
        this.plate = new Plate(this.app, new THREE.Vector3(0,4.4,0));
        this.lamp = new Lamp(this.app, new THREE.Vector3(0, 17, 0));
        this.chair = new Chair(this.app.scene, new THREE.Vector3(1.5,0, -8), -Math.PI/6)
        this.newsPaper= new NewsPaper(this.app.scene, this.builder, new THREE.Vector3(3,4.9,-4) ,Math.PI/3, -Math.PI/4)
        this.carpet = new Carpet(this.app.scene, 15,15,new THREE.Vector3(0,0.1,0))
        this.spring = new Spring(this.app.scene , new THREE.Vector3(-3,4.2,3))
        this.jar = new Jar(this.app.scene, this.builder, new THREE.Vector3(3,4.2,3))
        this.couch = new Couch(this.app.scene,new THREE.Vector3(12,0,15),Math.PI)
        this.floor_lamp = new FloorLamp(this.app.scene,this.builder, new THREE.Vector3(5,0.2,14), Math.PI/3 )
        this.book = new Book(this.app.scene, this.builder,0x008833, new THREE.Vector3(-4, 4.25,-4.5),0,-Math.PI/8)
        this.shelve = new Shelve(this.app.scene, this.builder, new THREE.Vector3(-3,0,20),Math.PI)
        this.frameStudent1 = new Frame(this.app, new THREE.TextureLoader().load('textures/202108793.jpg'), 2, 3, 0.4, "#ce9c69", new THREE.Vector3(5, 10, -19.6), new THREE.Vector3(0, 0, 0));
        this.frameStudent2 = new Frame(this.app, new THREE.TextureLoader().load('textures/202108794.jpg'), 2, 3, 0.4, "#ce9c69", new THREE.Vector3(-5, 10, -19.6), new THREE.Vector3(0, 0, 0));
        this.landscape = new Landscape(this.app, new THREE.TextureLoader().load('textures/landscape.png'), new THREE.Vector3(300, 50, 0), new THREE.Vector3(0, - Math.PI / 2, 0));
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
            this.lamp.enable();
            this.landscape.enable();
            this.chair.enable()
            this.newsPaper.enable()
            this.carpet.enable()
            this.spring.enable()
            this.jar.enable()
            this.couch.enable()
            this.floor_lamp.enable()
            this.book.enable()
            this.shelve.enable()
        }
        else {
            this.house.disable();
            this.table.disable();
            this.cake.disable();
            this.plate.disable();
            this.frameStudent1.disable();
            this.frameStudent2.disable();
            this.lamp.disable();
            this.landscape.disable();
        }
    }



}

export { MyContents };
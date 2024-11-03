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
import { Paint } from './objects/paint.js';
import { Mug } from './objects/mug.js';
import { Banner } from './objects/banner.js';
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

        this.builder = new MyNurbsBuilder();
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
        this.table = new Table(this.app.scene, 10, 10, 0.5, 4, 0.25);
        this.cake = new Cake(this.app.scene,9, new THREE.Vector3(0,4.1,0), -Math.PI);
        this.plate = new Plate(this.app.scene, new THREE.Vector3(0,4.2,0));
        this.lamp = new Lamp(this.app.scene, new THREE.Vector3(0, 17, 0));
        this.chair = new Chair(this.app.scene, new THREE.Vector3(1.5,0, -8), -Math.PI/6)
        this.newsPaper= new NewsPaper(this.app.scene, this.builder, new THREE.Vector3(3,4.9,-4) ,Math.PI/3, -Math.PI/4)
        this.carpet = new Carpet(this.app.scene, 15,15,new THREE.Vector3(0,0.1,0))
        this.spring = new Spring(this.app.scene , new THREE.Vector3(-3,4.2,3))
        this.jar = new Jar(this.app.scene, this.builder, new THREE.Vector3(3,4.2,3))
        this.couch = new Couch(this.app.scene,new THREE.Vector3(6,0,16),Math.PI)
        this.mini_table = new Table(this.app.scene, 5, 3, 0.5, 3, 0.25, new THREE.Vector3(12,0,16));
        this.floor_lamp = new FloorLamp(this.app.scene, new THREE.Vector3(0,0.2,16), Math.PI/2 )
        this.book = new Book(this.app.scene, this.builder,0xaa8833, new THREE.Vector3(12, 3.25,14),0,-Math.PI/8)
        this.shelve = new Shelve(this.app.scene, this.builder, new THREE.Vector3(-10,0,20),Math.PI)
        this.paint = new Paint(this.app.scene, new THREE.Vector3(-20,8,15),Math.PI/2)
        this.door = new Frame(this.app, new THREE.TextureLoader().load('textures/door.jpg'), 5, 12, 0.5, "#ce9c69", new THREE.Vector3(-19.9, 6, 0), new THREE.Vector3(0, Math.PI / 2, 0));
        this.cakePiece = new Cake(this.app.scene,1,new THREE.Vector3(-0.2,4.1,-4.8))
        this.smallPlate = new Plate(this.app.scene, new THREE.Vector3(0,4.2,-4), 1.2);
        this.mug = new Mug(this.app.scene, this.builder, new THREE.Vector3(-2.5,4.3,-2.5), Math.PI/4)
        this.frameStudent1 = new Frame(this.app, new THREE.TextureLoader().load('textures/202108793.jpg'), 2, 3, 0.4, "#ce9c69", new THREE.Vector3(10, 10, -19.6), new THREE.Vector3(0, 0, 0));
        this.frameStudent2 = new Frame(this.app, new THREE.TextureLoader().load('textures/202108794.jpg'), 2, 3, 0.4, "#ce9c69", new THREE.Vector3(-10, 10, -19.6), new THREE.Vector3(0, 0, 0));
        this.frameProf = new Frame(this.app, new THREE.TextureLoader().load('textures/prof.jpg'), 5, 3, 0.4, "#ce9c69", new THREE.Vector3(0, 10, -19.6), new THREE.Vector3(0, 0, 0));
        this.landscape = new Landscape(this.app.scene, new THREE.TextureLoader().load('textures/landscape.png'), new THREE.Vector3(90, 50, 0), new THREE.Vector3(0, - Math.PI / 2, 0));
        this.banner = new Banner(this.app.scene, new THREE.TextureLoader().load('textures/banner.jpg'), new THREE.Vector3(0, 16, -19.9), new THREE.Vector3(0, 0, 0))
        this.enableScene3D();

        this.ceilingLight = this.lamp.getLight(); 
        this.floorLight = this.floor_lamp.getLight();
        this.landscapeLight = this.landscape.getLight();

    }
    
    enableScene3D() {
        if (this.scene3DEnabled) {
            this.house.enable();
            this.table.enable();
            this.cake.enable();
            this.plate.enable();
            this.frameStudent1.enable();
            this.frameStudent2.enable();
            this.frameProf.enable();
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
            this.paint.enable()
            this.mini_table.enable()
            this.door.enable()
            this.mug.enable()
            this.cakePiece.enable()
            this.smallPlate.enable()
            this.banner.enable()
        }
        else {
            this.house.disable();
            this.table.disable();
            this.cake.disable();
            this.plate.disable();
            this.frameStudent1.disable();
            this.frameStudent2.disable();
            this.frameProf.disable();
            this.lamp.disable();
            this.landscape.disable();
            this.chair.disable()
            this.newsPaper.disable()
            this.carpet.disable()
            this.spring.disable()
            this.jar.disable()
            this.couch.disable()
            this.floor_lamp.disable()
            this.book.disable()
            this.shelve.disable()
            this.paint.disable()
            this.mini_table.disable()
            this.mug.disable()
            this.cakePiece.disable()
            this.smallPlate.disable()
            this.door.disable()
            this.banner.disable()
        }
    }

    /**
     * Update the contents
     */
    update() {
        
    }


}

export { MyContents };
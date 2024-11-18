import * as THREE from 'three';
import { Book } from './book.js';


export class Shelve{
    /**
     * 
     * @param {*} scene 
     * @param {*} builder builder to pass to the books objects
     * @param {THREE.Vector3} position Position of the shelve
     * @param {float} angle Angle that the shelve will rotate in y
     */
    constructor(scene,builder, position = new THREE.Vector3(0,0,0) , angle = 0) {
        this.scene = scene
        this.builder = builder
        this.position = position
        this.angle = angle
        this.shelve = new THREE.Group();
        this.init()
    }
    /**
    * Initialize the shelve object with the books
    */
    init() {
        let map =new THREE.TextureLoader().load( 'textures/light_wood.jpg' );
        map.colorSpace = THREE.SRGBColorSpace;

        this.shelveMaterial = new THREE.MeshLambertMaterial( { map: map } );
        
        this.drawShelve()
        this.drawBooks()
        this.shelve.position.add(this.position)
        this.shelve.rotateY(this.angle)
    }
    /**
     * Creates shelve object
     */
    drawShelve(){
        this.shelve.add(this.drawPlank(5,14,new THREE.Vector3(0,7,0)))
        this.shelve.add(this.drawPlank(3,14,new THREE.Vector3(-2.5,7,1.5),0,Math.PI/2))
        this.shelve.add(this.drawPlank(3,14,new THREE.Vector3(2.5,7,1.5),0,Math.PI/2))
        this.shelve.add(this.drawPlank(5,3,new THREE.Vector3(0,0.15,1.5),-Math.PI/2))
        this.shelve.add(this.drawPlank(5,3,new THREE.Vector3(0,3.65,1.5),-Math.PI/2))
        this.shelve.add(this.drawPlank(5,3,new THREE.Vector3(0,7.15,1.5),-Math.PI/2))
        this.shelve.add(this.drawPlank(5,3,new THREE.Vector3(0,10.65,1.5),-Math.PI/2))
        this.shelve.add(this.drawPlank(5,3,new THREE.Vector3(0,13.85,1.5),-Math.PI/2))
    }
    /**
     * Creates a plank object
     * @param {*} width width of the plank
     * @param {*} height height of the plank
     * @param {*} position position of the plank
     * @param {*} anglex Angle that the plank will rotate in X
     * @param {*} angley Angle that the plank will rotate in Y
     * @returns 
     */
    drawPlank(width,height,position, anglex=0, angley=0){
        const geometry = new THREE.BoxGeometry(width,height,0.3)
        const plank = new THREE.Mesh(geometry, this.shelveMaterial)
        plank.castShadow = plank.receiveShadow = true
        plank.position.add(position)
        plank.rotateY(angley)
        plank.rotateX(anglex)
     
        return plank
    }
    /**
     * adds the books to the shelve
     */
    drawBooks(){
        let angle =-Math.PI/2

        // Highest shelve books
        this.shelve.add(new Book(this.scene,this.builder, 0x648964,new THREE.Vector3(1,10.6,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0x98727a,new THREE.Vector3(0.6,10.6,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0xD5A271,new THREE.Vector3(1.4,10.6,0.5),angle,angle,angle/8).getMesh())
   
        // Middle shelve books
        this.shelve.add(new Book(this.scene,this.builder, 0x5648aa,new THREE.Vector3(-1.9,7.3,0.5),angle,angle,-angle/8).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0x3caa00,new THREE.Vector3(-1.5,7.3,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0xb4caa,new THREE.Vector3(-1.1,7.3,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0xaa7654,new THREE.Vector3(-0.7,7.3,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0x32aaf5,new THREE.Vector3(-0.3,7.3,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0xde1faa,new THREE.Vector3(0.1,7.3,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0x34aa74,new THREE.Vector3(0.5,7.3,0.5),angle,angle).getMesh())
        // Bottom shelve books
        this.shelve.add(new Book(this.scene,this.builder, 0x123456,new THREE.Vector3(-2,4.2,1.2),0,-angle/3,0).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0x789abc,new THREE.Vector3(-1,3.8,0.5),0,angle/3,0).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0xdf1234,new THREE.Vector3(0.2,3.8,0.7),0,-angle/8,0).getMesh())
        
        
    }
    /**
    * Enables the shelve object in the scene
    */
    enable(){
        this.scene.add(this.shelve)
    }
    /**
    * Disables the shelve object in the scene
    */
    disable(){

        this.scene.remove( this.shelve )
    }

}


import * as THREE from 'three';
import { Book } from './book.js';

export class Shelve{

    constructor(scene,builder, position = new THREE.Vector3(0,0,0) , angle = 0) {
        this.scene = scene
        this.builder = builder
        this.position = position
        this.angle = angle
        this.shelve = new THREE.Group();
        this.init()
    }

    init() {
        let map =new THREE.TextureLoader().load( 'textures/light_wood.jpg' );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        map.anisotropy = 16;

        map.colorSpace = THREE.SRGBColorSpace;

        this.shelveMaterial = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide} );
        
        this.drawShelve()
        this.drawBooks()
        this.shelve.position.add(this.position)
        this.shelve.rotateY(this.angle)

       
    }

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

    drawPlank(width,height,position, anglex=0, angley=0){
        const geometry = new THREE.BoxGeometry(width,height,0.3)
        const plank = new THREE.Mesh(geometry, this.shelveMaterial)
        plank.position.add(position)
        plank.rotateY(angley)
        plank.rotateX(anglex)
     
        return plank
    }

    drawBooks(){
        let angle =-Math.PI/2
        this.shelve.add(new Book(this.scene,this.builder, 0x648964,new THREE.Vector3(1,0.3,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0x98727a,new THREE.Vector3(0.6,0.3,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0xD5A271,new THREE.Vector3(1.4,0.3,0.5),angle,angle,angle/8).getMesh())

        this.shelve.add(new Book(this.scene,this.builder, 0x123456,new THREE.Vector3(-2,4.2,1.2),0,-angle/3,0).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0x789abc,new THREE.Vector3(-1,3.8,0.5),0,angle/3,0).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0xdf1234,new THREE.Vector3(0.2,3.8,0.7),0,-angle/8,0).getMesh())

        this.shelve.add(new Book(this.scene,this.builder, 0x5648aa,new THREE.Vector3(-1.9,7.3,0.5),angle,angle,-angle/8).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0x3caa00,new THREE.Vector3(-1.5,7.3,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0xb4caa,new THREE.Vector3(-1.1,7.3,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0xaa7654,new THREE.Vector3(-0.7,7.3,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0x32aaf5,new THREE.Vector3(-0.3,7.3,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0xde1faa,new THREE.Vector3(0.1,7.3,0.5),angle,angle).getMesh())
        this.shelve.add(new Book(this.scene,this.builder, 0x34aa74,new THREE.Vector3(0.5,7.3,0.5),angle,angle).getMesh())
        
        
    }

    enable(){
        this.scene.add(this.shelve)
    }

}


import * as THREE from 'three';
import { Flower } from './flower.js';


export class Jar {
    constructor(scene, builder, position = new THREE.Vector3(0, 0, 0)) {
        this.scene = scene;
        this.builder = builder;
        this.position = position;

        this.jarGroup = new THREE.Group();
        this.init();
    }

    /**
     * Initialize the jar by creating the bottom and up curved surfaces and adding flowers
     */
    init() {

        this.samplesU = 50; // Increased for smoother surface
        this.samplesV = 20; 
        const map = new THREE.TextureLoader().load('textures/glass.jpg');
        map.colorSpace = THREE.SRGBColorSpace;

        this.material = new THREE.MeshLambertMaterial({
            map: map,
            transparent: true,
            side: THREE.DoubleSide,
            opacity: 0.5
        });

        this.jarGroup.add(this.bottom())
        this.jarGroup.add(this.up())
        let flowerPos = new THREE.Vector3(0,0.5,0)
        this.jarGroup.add((new Flower(this.scene,5,0xcc9900,flowerPos)).getMesh())
        this.jarGroup.add((new Flower(this.scene,5,0x77AAAA,flowerPos, 1.5)).getMesh())
        this.jarGroup.add((new Flower(this.scene,5,0xAA7799,flowerPos,4)).getMesh())

        this.jarGroup.position.add(this.position)

    }

    /**
     * Creates the bottom curved surface of the jar
     * @returns {THREE.Mesh} A mesh representing the bottom of the jar
     */
    bottom(){
        let controlPoints;
        let surfaceData;

        let orderU = 4;
        let orderV = 32;

        // Build NURBS surface control points for a rounded jar
        controlPoints = [];
        controlPoints.push(this.circle(0,0,orderV,2))
        controlPoints.push(this.circle(0.8,0,orderV,2))
        controlPoints.push(this.circle(1,0.5,orderV))
        controlPoints.push(this.circle(1,2,orderV))
        controlPoints.push(this.circle(0.5,2.5,orderV))

        // Build NURBS surface
        surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        this.bottomMesh = new THREE.Mesh(surfaceData, this.material);
        this.bottomMesh.castShadow = true;
        return this.bottomMesh
    }

    /**
     * Creates the top curved surface of the jar
     * @returns {THREE.Mesh} A mesh representing the top of the jar
     */
    up(){
        let orderU = 2;
        let orderV = 32;

        let controlPoints = [];
        controlPoints.push(this.circle(0.5,0,orderV,2))
        controlPoints.push(this.circle(0.3,0.3,orderV,2))
        controlPoints.push(this.circle(0.5,0.5,orderV))

        // Build NURBS surface
        let surfaceData = this.builder.build(
            controlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        this.topMesh = new THREE.Mesh(surfaceData, this.material);
        this.topMesh.castShadow = true;
        this.topMesh.position.set(0,2.5,0)
        return this.topMesh
    }

    /**
     * @param {Number} radius 
     * @param {Number} height 
     * @param {Number} segments 
     * @param {Number} importance 
     * @returns {Array} An array of points representing a circle 
     */
    circle(radius, height, segments, importance = 1){
        let points = []
        for (let i = 0; i<= segments; i++){
            let j = (Math.PI*2.0)/(segments)
            j= j*i
            points.push(
                    [ radius*Math.cos(j), height, radius*Math.sin(j), importance ]
            )
        
        }
        return points
    }

    /**
     * Enable the frame by adding it to the scene
     */
    enable() {
        this.scene.add(this.jarGroup);
    }

    /**
     * Disable the frame by removing it from the scene
     */
    disable(){

        this.scene.remove( this.jarGroup )
    }
}

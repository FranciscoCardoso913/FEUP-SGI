import * as THREE from 'three';
import { Flower } from './flower.js';


export class Jar {
    constructor(scene, builder, position = new THREE.Vector3(0, 0, 0)) {
        this.scene = scene;
        this.builder = builder;
        this.position = position;

        this.jarGroup = new THREE.Group()
        this.init();
    }

    init() {

        this.samplesU = 50; // Increased for smoother surface
        this.samplesV = 20; 
        const map = new THREE.TextureLoader().load('textures/glass.jpg');
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;

        this.material = new THREE.MeshLambertMaterial({
            map: map,
            side: THREE.DoubleSide,
            transparent: true,
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

    bottom(){
        let controlPoints;
        let surfaceData;

        let orderU = 4;
        let orderV = 32;

        // Build NURBS surface control points for a rounded jar
        controlPoints = [
        
        ];

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
        return this.bottomMesh
    }

    up(){
        let controlPoints = [
        
        ];

        let orderU = 2;
        let orderV = 32;
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
        this.topMesh.position.set(0,2.5,0)
        return this.topMesh
    }

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

    activate() {
        this.scene.add(this.jarGroup);
    }
}

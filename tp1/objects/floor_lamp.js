import * as THREE from 'three';

export class FloorLamp{

    constructor(scene,builder, position = new THREE.Vector3(0,0,0), angle=0) {
        this.scene = scene
        this.builder = builder
        this.position = position
        this.floor_lamp = new THREE.Group()
        this.angle = angle
        this.init()
    }

    init() {
    

        this.poleMaterial = new THREE.MeshStandardMaterial({ color: 0x777777, side: THREE.DoubleSide });
        this.samplesU = 20;
        this.samplesV = 50;
        this.floor_lamp.rotateY(this.angle)
        this.floor_lamp.add(this.drawPole())
        this.floor_lamp.add(this.drawBase())
        this.floor_lamp.add(this.drawLamp())
        this.floor_lamp.add(this.light())

        this.floor_lamp.position.add(this.position)
    
    }

    drawPole(){
        const startPoint = new THREE.Vector3(0, 0, 0); // starting point
        const controlPoint1 = new THREE.Vector3(0, 3, 0); // first control point
        const controlPoint2 = new THREE.Vector3(0, 5, 1); // second control point
        const endPoint = new THREE.Vector3(0, 3, 2); // ending point

        this.tangentVector = new THREE.Vector3().subVectors(endPoint, controlPoint2).multiplyScalar(3).normalize(); //direction

        const bezierCurve = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

        const tubeGeometry = new THREE.TubeGeometry(bezierCurve, 50, 0.1, 8, false);
        let topPole = new THREE.Mesh(tubeGeometry, this.poleMaterial);

        const geometry = new THREE.CylinderGeometry(
            0.1,         // Radius at the top
            0.1,      // Radius at the bottom
            6,            // Height of the cylinder
            10     // Radial segments for smoothness
        );
        let bottomPole = new THREE.Mesh(geometry, this.poleMaterial);

        topPole.position.y+= 6;
        bottomPole.position.y+=3
        let pole = new THREE.Group()
        pole.add(topPole)
        pole.add(bottomPole)
        return pole
    }


    drawBase(){
        const geometry = new THREE.ConeGeometry(
            1,           // Radius at the base of the cone
            0.5,           // Height of the cone
            10    // Radial segments for smoothness
        );

        
        let base = new THREE.Mesh(geometry, this.poleMaterial);
        return base
    }

    drawLamp(){
        const geometry = new THREE.ConeGeometry(
            1,           // Radius at the base of the cone
            0.5,           // Height of the cone
            10  ,
            1,
            true  // Radial segments for smoothness
        );

        
        let lamp = new THREE.Mesh(geometry, this.poleMaterial);
        lamp.position.y+=9
        lamp.position.z+=2
        const angleWithY = Math.acos(this.tangentVector.dot(new THREE.Vector3(0,-1,0)));
        lamp.rotateX(-angleWithY)
        return lamp
    }
    light(){
        const spotLight = new THREE.SpotLight(0xcc9900, 100,25,Math.PI/5,0.3,1);

        // Set the position of the light
        spotLight.position.set(0, 9 ,2);
        let targetPosition = this.calculateIntersectionWithYZero(new THREE.Vector3(0,9,2), this.tangentVector)
        // Set target position for the spotlight direction
        spotLight.target.position.set(targetPosition.x , targetPosition.y, targetPosition.z );
        
        // Add the target to the scene so the light can aim at it
        this.floor_lamp.add(spotLight.target);
    
    

        return spotLight
    }

    calculateIntersectionWithYZero(initialPoint, directionVector) {
        const x0 = initialPoint.x
        const y0 = initialPoint.y;
        const z0 = initialPoint.z 
    
        const dx = directionVector.x 
        const dy = directionVector.y;
        const dz = directionVector.z 
    
        // Calculate parameter t for y = 0
        const t = -y0 / dy;
    
        // Calculate the intersection point
        const intersectionPoint = {
            x: x0 + t * dx,
            y: 0,                // y = 0 at intersection
            z: z0 + t * dz
        };
    
        return intersectionPoint;
    }

    enable(){

        this.scene.add( this.floor_lamp )
    }

    disable(){

        this.scene.remove( this.floor_lamp )
    }
}
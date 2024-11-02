import * as THREE from 'three';

export class FloorLamp{

    constructor(scene, position = new THREE.Vector3(0,0,0), angle=0) {
        this.scene = scene
        this.position = position
        this.floor_lamp = new THREE.Group()
        this.angle = angle
        this.init()
    }

    /**
     * Initializes the floor lamp object
     * The floor lamp is composed of a pole, a base, a lamp and a light. 
     * The pole is a bezier curve with a tube geometry.
     * The base is a cone geometry.
     * The lamp is a cone geometry.
     * The light is a spotlight.
     */
    init() {
        
        this.poleMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
        this.floor_lamp.rotateY(this.angle)
        this.floor_lamp.add(this.drawPole())
        this.floor_lamp.add(this.drawBase())
        this.floor_lamp.add(this.drawLamp())
        this.floor_lamp.add(this.light())
        this.floor_lamp.position.add(this.position)
    
    }

    /**
     * Draws a tube geometry following a bezier curve and a cylinder geometry for the pole of the floor lamp and returns a group with both geometries
     * @returns {THREE.Group} Group representing the pole of the floor lamp
     */
    drawPole(){

        // Drawing the bezier curve
        const startPoint = new THREE.Vector3(0, 0, 0); // starting point
        const controlPoint1 = new THREE.Vector3(0, 3, 0); // first control point
        const controlPoint2 = new THREE.Vector3(0, 5, 1); // second control point
        const endPoint = new THREE.Vector3(0, 3, 2); // ending point
        this.tangentVector = new THREE.Vector3().subVectors(endPoint, controlPoint2).multiplyScalar(3).normalize(); //direction
        const bezierCurve = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
        
        // Top pole, the tube geometry
        const tubeGeometry = new THREE.TubeGeometry(bezierCurve, 50, 0.1, 8, false);
        let topPole = new THREE.Mesh(tubeGeometry, this.poleMaterial);
        topPole.receiveShadow = topPole.castShadow = true;

        // Bottom pole, the cylinder geometry
        const geometry = new THREE.CylinderGeometry( 0.1, 0.1, 6, 10);
        let bottomPole = new THREE.Mesh(geometry, this.poleMaterial);
        bottomPole.castShadow = bottomPole.receiveShadow = true;

        // Positioning the poles
        topPole.position.y+= 6;
        bottomPole.position.y+=3

        // Grouping the poles
        let pole = new THREE.Group()
        pole.add(topPole)
        pole.add(bottomPole)
        return pole
    }

    /**
     * Creates a cone geometry representing the base of the floor lamp
     * @returns {THREE.Mesh} Cone geometry representing the base of the floor lamp
     */
    drawBase(){

        // base geometry
        const geometry = new THREE.ConeGeometry( 1, 0.5, 10 );
        let base = new THREE.Mesh(geometry, this.poleMaterial);

        // base attributes
        base.castShadow = base.receiveShadow = true;
        return base
    }

    /**
     * 
     * @returns {THREE.Mesh} Cone geometry representing the structure surrounding the light
     */
    drawLamp(){

        // lamp geometry
        const geometry = new THREE.ConeGeometry( 1, 0.5, 10, 1, true );
        let lampMaterial = new THREE.MeshPhongMaterial({ color: 0x777777, side: THREE.DoubleSide });
        let lamp = new THREE.Mesh(geometry, lampMaterial);

        // lamp attributes
        lamp.castShadow = lamp.receiveShadow = true;
        lamp.position.y+=9
        lamp.position.z+=2
        const angleWithY = Math.acos(this.tangentVector.dot(new THREE.Vector3(0,-1,0)));
        lamp.rotateX(-angleWithY)
        
        return lamp
    }


    light(){
        const spotLight = new THREE.SpotLight(0xcc9900, 100,25,Math.PI/5,0.3,1);

        // Spotlight Shadows
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;

        // Set the position of the light
        spotLight.position.set(0, 9 ,2);
        let targetPosition = this.calculateIntersectionWithYZero(new THREE.Vector3(0,9,2), this.tangentVector)
        // Set target position for the spotlight direction
        spotLight.target.position.set(targetPosition.x , targetPosition.y, targetPosition.z );
        
        // Add the target to the scene so the light can aim at it
        this.floor_lamp.add(spotLight.target);

        return spotLight
    }

    /**
     * @param {Number} initialPoint 
     * @param {Number} directionVector 
     * @returns {THREE.Vector3} Intersection point with the y=0 plane
     */
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

    /**
     * Adds the floor lamp to the scene
     */
    enable(){
        this.scene.add( this.floor_lamp )
    }

    /**
     * Removes the floor lamp from the scene
     */
    disable(){
        this.scene.remove( this.floor_lamp )
    }
}
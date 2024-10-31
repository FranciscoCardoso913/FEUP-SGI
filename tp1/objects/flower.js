import * as THREE from 'three';

export class Flower{

    constructor(scene, petals = 5, color= 0xcc9900, position = new THREE.Vector3(0,0,0) , angle = 0) {
        this.scene = scene
        this.petals = petals
        this.position = position
        this.color = color
        this.angle = angle
        this.flowerGroup = new THREE.Group();
        this.init()
    }

    init() {
        this.flowerGroup.add(this.frontCenter());
        this.flowerGroup.add(this.backCenter());
        this.flowerGroup.add(this.createStem());

        // Create petals and add to the group
        for (let i = 0; i < Math.PI * 2; i += (Math.PI * 2) / this.petals) {
            this.flowerGroup.add(this.createPetal(i));
        }

        this.flowerGroup.position.add(this.position)

        this.flowerGroup.rotateY(this.angle)



    }
    frontCenter(){
        const radius = 0.3; // Radius of the sphere
        const widthSegments = 12; // Number of horizontal segments
        const heightSegments = 12; // Number of vertical segments
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    

        // Create a material for the sphere
        const map =new THREE.TextureLoader().load( 'textures/flower.jpg' );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;

        map.anisotropy = 16;

        map.colorSpace = THREE.SRGBColorSpace;

        let material = new THREE.MeshLambertMaterial( { map: map,

                    transparent: true, opacity: 1 } );



        // Create a mesh by combining geometry and material
        const frontSphere = new THREE.Mesh(sphereGeometry, material);
        frontSphere.castShadow = true;
        frontSphere.scale.z = 0.4
        frontSphere.position.z+=1
        frontSphere.position.y+=3
        return frontSphere
       
    }

    backCenter(){
        const radius = 0.3; // Radius of the sphere
        const widthSegments = 12; // Number of horizontal segments
        const heightSegments = 12; // Number of vertical segments
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);


        // Create a material for the sphere

        const backMaterial = new THREE.MeshBasicMaterial({ color: 0x006600, wireframe: false }); // Change wireframe to true for a wireframe sphere

        const backSphere = new THREE.Mesh(sphereGeometry, backMaterial);
        backSphere.castShadow = true;
        
        backSphere.scale.z =0.4
        backSphere.position.z +=0.9
        backSphere.position.y+=3
        return backSphere
       
    }

    createPetal(angle) {
        // Define the petal shape
        const petalShape = new THREE.Shape();
        
        // Move to the starting point of the petal
        petalShape.moveTo(0, 0);

        // Draw curves to form a round-shaped petal
        const radius = 0.4; // Adjust the size of the petal
        petalShape.quadraticCurveTo(-radius, radius, 0, radius * 2);  // Left side curve
        petalShape.quadraticCurveTo(radius, radius, 0, 0);            // Right side curve

        // Create geometry from the shape
        const petalGeometry = new THREE.ShapeGeometry(petalShape);
        
        // Define material for the petal
        const petalMaterial = new THREE.MeshBasicMaterial({
            color: this.color, side: THREE.DoubleSide
        });

        // Create the petal mesh and set its position
        let petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.castShadow = petal.receiveShadow = true;
        petal.rotateZ(angle)
        petal.position.z+=1
        petal.position.y+=3
        return petal
    }

    createStem() {

        this.start = new THREE.Vector3(0,0,0);
        this.end = new THREE.Vector3(0, 3,1);
        // Define points for the stem curve
        const points = [
            this.start,
            new THREE.Vector3(this.start.x +0.1 , this.start.y +0.5 , this.start.z +0.1), // Bend point
            new THREE.Vector3(this.end.x -0.1, this.end.y -0.1  , this.end.z -0.5), // Additional bend
            this.end,
        ];

        // Create a Catmull-Rom curve for a smooth, organic stem shape
        const stemCurve = new THREE.CatmullRomCurve3(points);

        // Create geometry for the line using the curve points
        const geometry = new THREE.BufferGeometry().setFromPoints(stemCurve.getPoints(50));

        // Define material for the stem
        const material = new THREE.LineBasicMaterial({ color: 0x228B22, linewidth: 5 });

        // Create the line mesh for the stem
        let stem = new THREE.Line(geometry, material);
        stem.castShadow = stem.receiveShadow = true;
        return stem

    }
    activate(){
        this.scene.add(this.flowerGroup)
    }
    disable(){

        this.scene.remove( this.flowerGroup )
    }
    getMesh(){
        return this.flowerGroup
    }
}
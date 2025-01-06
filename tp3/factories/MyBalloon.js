import * as THREE from 'three';

class MyBalloon{

    constructor(color = 0x00a2f1, position =new THREE.Vector3(0,0,0)) {
        this.color = color
        this.position = position
        this.vx = 0
        this.vz = 0
        this.cooldown = false
        this.build()
    }

    build(){
        // Create the hot air balloon using Level of Detail (LOD)
        const lod = new THREE.LOD();

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('image/textures/ballon.webp');

        // Set wrapping and repeat properties
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1); // Adjust as needed to fit the sphere

        const basqueTexture = textureLoader.load('image/textures/basket.jpg');

        // Set wrapping and repeat properties
        basqueTexture.wrapS = THREE.RepeatWrapping;
        basqueTexture.wrapT = THREE.RepeatWrapping;
        basqueTexture.repeat.set(1, 1); // Adjust as needed to fit the sphere

        // High-detail model
        const highDetailGeometry = new THREE.SphereGeometry(1, 32, 32, 0, 2* Math.PI, 0, 5/6 * Math.PI);
        const highDetailMaterial = new THREE.MeshBasicMaterial({ color: this.color, wireframe: false, side: THREE.DoubleSide, map: texture });
        const highDetailMesh = new THREE.Mesh(highDetailGeometry, highDetailMaterial);
        highDetailMesh.scale.copy(new THREE.Vector3(1,1.3,1))

        lod.addLevel(highDetailMesh, 0);

        // Medium-detail model
        const mediumDetailGeometry = new THREE.SphereGeometry(1, 16, 16, 0, 2* Math.PI, 0, 5/6 * Math.PI);
        const mediumDetailMaterial = new THREE.MeshBasicMaterial({ color: this.color, wireframe: false ,side: THREE.DoubleSide, map: texture });
        const mediumDetailMesh = new THREE.Mesh(mediumDetailGeometry, mediumDetailMaterial);
        mediumDetailMesh.scale.copy(new THREE.Vector3(1,1.3,1))
        lod.addLevel(mediumDetailMesh, 10);

        // Low-detail model
        const lowDetailGeometry = new THREE.SphereGeometry(1, 8, 8, 0, 2* Math.PI, 0, 5/6 * Math.PI);
        const lowDetailMaterial = new THREE.MeshBasicMaterial({ color: this.color, wireframe: false , side: THREE.DoubleSide, map: texture });
        const lowDetailMesh = new THREE.Mesh(lowDetailGeometry, lowDetailMaterial);
        lowDetailMesh.scale.copy(new THREE.Vector3(1,1.3,1))
        lod.addLevel(lowDetailMesh, 20);

        // Add a basket to the balloon (just a simple box)
        const basketGeometry = new THREE.BoxGeometry(0.7, 0.5, 0.7);
        const basketMaterial = new THREE.MeshBasicMaterial({ color: 0xaa7664 , map :basqueTexture});
        const basketMesh = new THREE.Mesh(basketGeometry, basketMaterial);
        basketMesh.position.set(0, -1.5, 0);



        // Combine the balloon and the basket
        const balloonGroup = new THREE.Group();

        // Add connecting wooden cylinders
        const woodMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
        const woodCylinders = [];
        const cylinderPositions = [
        [-0.25, -0.85, 0.25],
        [0.25, -0.85, 0.25],
        [-0.25, -0.85, -0.25],
        [0.25, -0.85, -0.25]
        ];

        cylinderPositions.forEach(position => {
        const woodGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.0, 16);
        const woodMesh = new THREE.Mesh(woodGeometry, woodMaterial);
        woodMesh.position.set(...position);
        woodMesh.rotation.x = Math.PI* position[2]*0.8;
        woodCylinders.push(woodMesh);
        balloonGroup.add(woodMesh);
        });
        lod.position.add( new THREE.Vector3(0,0.5,0))
        balloonGroup.add(lod);
        balloonGroup.add(basketMesh);

        // Create a small fire using a sphere and a cone
        const fireGroup = new THREE.Group();

        // Fire base (sphere)
        const fireBaseGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const fireBaseMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500 });
        const fireBaseMesh = new THREE.Mesh(fireBaseGeometry, fireBaseMaterial);
        fireBaseMesh.position.set(0, -1, 0);
        fireGroup.add(fireBaseMesh);

        // Fire flames (cone)
        const fireFlameGeometry = new THREE.ConeGeometry(0.15, 0.3, 16);
        const fireFlameMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500 });
        const fireFlameMesh = new THREE.Mesh(fireFlameGeometry, fireFlameMaterial);
        fireFlameMesh.position.set(0, -0.8, 0);
        fireGroup.add(fireFlameMesh);

        balloonGroup.add(fireGroup)

        balloonGroup.position.add(this.position)

        this.ballon = balloonGroup
    }

    getObject(){
        return this.ballon
    }

    getRotationAnglesToVector( targetVector) {
        // Step 1: Define the initial direction of the balloon (assuming it's pointing along the positive z-axis)
        const initialDirection = new THREE.Vector3(0, 1, 0); // z-axis

        targetVector.y +=7
    
        // Step 2: Normalize the target vector
        const targetDir = targetVector.clone().normalize();
    
        // Step 3: Compute the quaternion that rotates from initialDirection to targetDir
        const axis = new THREE.Vector3().crossVectors(initialDirection, targetDir).normalize(); // Rotation axis
        const angle = Math.acos(initialDirection.dot(targetDir)); // Angle between the two vectors
    
        // Step 4: Create the quaternion to rotate the balloon
        const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    
        // Step 5: Convert the quaternion to Euler angles (in radians by default)
        const euler = new THREE.Euler().setFromQuaternion(quaternion);
    
        // Step 6: Return the Euler angles (in x, y, z)
        return new THREE.Vector3(
             euler.x,
             euler.y,
             euler.z
        )
    }

    moveWithSpeed(fps){
        if(!this.cooldown){
            this.ballon.position.x += this.vx * 1/fps
            this.ballon.position.z+= this.vz * 1/fps
        }
     
    }

    setDirection(speed,pos){
        this.cooldown = true
        let start = this.ballon.position.clone();
        let final = start.clone()
        this.vx = speed.x
        this.vz = speed.z
        let movement = start.clone()
        movement.x += this.vx/2
        movement.z += this.vz/2
        movement.y = start.y + (pos - start.y)

        final.x += this.vx
        final.y = pos
        final.z += this.vz



        const keyframes = [
            { time: 0, position: start, rotation: new THREE.Vector3(0, 0, 0) },
            { time: 0.5, position: movement , rotation: this.getRotationAnglesToVector(new THREE.Vector3(this.vx, 0, this.vz)) },
            { time: 1, position: final, rotation: this.getRotationAnglesToVector(new THREE.Vector3(this.vx, 0, this.vz)) },
            // Add more keyframes as necessary
          ];

          console.log(keyframes)
          (setTimeout(()=> this.cooldown=false,1000))

          return keyframes
    }

    move(position){
        let start = this.ballon.position.clone();
        this.ballon.position.copy(position)
        let movement = new THREE.Vector3().subVectors(this.ballon.position.clone(), start);
      
        const keyframes = [
            { time: 0, position: start, rotation: new THREE.Vector3(0, 0, 0) },
            { time: 0.5, position: new THREE.Vector3().addVectors(start , movement.clone().multiplyScalar(0.5)), rotation: this.getRotationAnglesToVector(movement.clone()) },
            { time: 1, position: position.clone(), rotation: new THREE.Vector3(0, 0, 0) },
            // Add more keyframes as necessary
          ];

          keyframes.forEach((keyframe, index) => {
            if (!keyframe.position || !(keyframe.position instanceof THREE.Vector3)) {
                console.error(`Keyframe at index ${index} has invalid position:`, keyframe);
            }
        });

          return keyframes
    }
}

export default MyBalloon;

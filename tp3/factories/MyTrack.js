import * as THREE from 'three';
import  MyPowerUp from './MyPowerUp.js';
import  MyObstacle from './MyObstacle.js';

class MyTrack  {

    
    /**
       constructs the object
       @param {Number} width The width of the track
    */
    constructor(path, width = 1, segments = 100) {
        this.path = path
        this.width = width

        // Multiply path points by the width, so that the track is created with the correct width
        // If we don't do this, the track will get weird formats when we change the width
        this.path.points = this.path.points.map(point => point.clone().multiplyScalar(this.width));

        this.segments = segments
        this.points = []

        this.prevPoint = null
        this.nextPoint = null
        this.crossedPoints =0
  
        this.track = this.createTrack()
     
        this.powerups_obj = this.createPowerUps()
        this.obstacles_obj = this.createObstacles()

    

    }

    /**
     * Creates the track
     */
    createTrack() {

        const texture = new THREE.TextureLoader().load("../image/textures/road.jpg");
        texture.wrapS = THREE.RepeatWrapping;
    
        this.material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
        this.material.map.repeat.set(1, 1);
        this.material.map.wrapS = THREE.RepeatWrapping;
        this.material.map.wrapT = THREE.RepeatWrapping;
    

        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });    


        let geometry = new THREE.TubeGeometry(
            this.path,
            this.segments,
            this.width,
            3 ,
            true
        );
        this.mesh = new THREE.Mesh(geometry, this.material);   

        this.points = this.path.getPoints(20)
        this.prevPoint =0
        this.nextPoint = 1
        let lineGeometry = new THREE.BufferGeometry().setFromPoints([...this.points]);
        this.line = new THREE.Line(lineGeometry, this.lineMaterial);
        this.line.position.y = 20;

        this.curve = new THREE.Group();
    
        this.mesh.visible = this.showMesh;
    
        this.curve.add(this.line);
        this.curve.add(this.mesh);

        this.points.forEach(point => {
            let sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
            let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.copy(point);
            sphere.position.y += 20
            this.curve.add(sphere);
        });
    
        this.curve.scale.set(1, 0.2, 1);
    
        
        return this.curve;
    }

    createPowerUps(){

        let powerups_positions = [
            new THREE.Vector3(-6,0,-7),
            new THREE.Vector3(3,0,-4),
            new THREE.Vector3(5,0,9.5),
        ]

        powerups_positions = powerups_positions.map(point => point.clone().multiplyScalar(this.width));

        // HardCoded Powerups so that we can have the powerups that were asked in the assignment
        this.powerups = [
            new MyPowerUp(powerups_positions[0]),
            new MyPowerUp(powerups_positions[1]),
            new MyPowerUp(powerups_positions[2]),
        ]

        let group = new THREE.Group();
        this.powerups.forEach(powerup => {
            group.add(powerup.getObject());
        });

        group.position.y = 10

        return group
    }

    createObstacles(){
        let obstacles_positions = [
           
            new THREE.Vector3(-4.8,0,-9.5),
            new THREE.Vector3(0,0,2.6),
            new THREE.Vector3(4,0,11),
            new THREE.Vector3(1,0,10.5),
        ]

        obstacles_positions = obstacles_positions.map(point => point.clone().multiplyScalar(this.width));

        // HardCoded obstacles so that we can have the obstacles that were asked in the assignment
        this.obstacles = [
            new MyObstacle(obstacles_positions[0]),
            new MyObstacle(obstacles_positions[1]),
            new MyObstacle(obstacles_positions[2]),
            new MyObstacle(obstacles_positions[3]),
        ]

        let group = new THREE.Group();
        this.obstacles.forEach(obstacle => {
            group.add(obstacle.getObject());
        });

        group.position.y = 10

        return group
    }

    changeLayer(pos){

        this.powerups_obj.position.y = pos;
        this.obstacles_obj.position.y = pos;

    }

    won(){
        return this.crossedPoints >= this.points.length
    }

    inside(position){

        function crossProduct(A, B, P) {
            const AB = new THREE.Vector2(B.x - A.x, B.z - A.z);
            const AP = new THREE.Vector2(P.x - A.x, P.z - A.z);
            return AB.x * AP.y - AB.y * AP.x;
        }
   
        let vector = new THREE.Vector3().subVectors(this.points[this.nextPoint].clone(), this.points[this.prevPoint].clone())

        let perp = new THREE.Vector3(0, 1, 0);  
        let perpendicular = new THREE.Vector3().crossVectors(vector, perp);
        perpendicular.normalize();  // Optional: normalize to get unit vector

        const halfWidth = this.width / 2;

        // Calculate the four points
        const A1 = new THREE.Vector3().addVectors(this.points[this.prevPoint].clone(), perpendicular.clone().multiplyScalar(halfWidth));
        const A2 = new THREE.Vector3().subVectors(this.points[this.prevPoint].clone(), perpendicular.clone().multiplyScalar(halfWidth));
        const B1 = new THREE.Vector3().addVectors(this.points[this.nextPoint].clone(), perpendicular.clone().multiplyScalar(halfWidth));
        const B2 = new THREE.Vector3().subVectors(this.points[this.nextPoint].clone(), perpendicular.clone().multiplyScalar(halfWidth));

        const cross1 = crossProduct(A1, A2, position)
        const cross2 = crossProduct(A2, B2, position)
        const cross3 = crossProduct(B2, B1, position)
        const cross4 = crossProduct(B1, A1, position)

 

    
        const inside = (cross1 >= 0 && cross2 >= 0 && cross3 >= 0 && cross4 >= 0) || (cross1 <= 0 && cross2 <= 0 && cross3 <= 0 && cross4 <= 0)

        if(!inside){
            if ((cross2 >0 && cross4<0) || (cross2 <0 && cross4>0) ) return false
            else if( cross1 > 0 && cross3 <0 ){
                this.prevPoint ++;
                this.nextPoint++;
                if(this.nextPoint >= this.points.length) this.nextPoint =0
                if(this.prevPoint >= this.points.length) this.prevPoint =0
                this.crossedPoints++;
            }
            else if( cross1 < 0 && cross3 >0 ){
                this.prevPoint --;
                this.nextPoint--;
                this.crossedPoints--;

                if(this.prevPoint< 0) this.prevPoint = this.points.length -1 
                if(this.nextPoint< 0) this.nextPoint = this.points.length -1 
               
            }
            else{
                console.log("Error in collision")
            }
            
        }
        return true
    
    }





}

export default MyTrack ;

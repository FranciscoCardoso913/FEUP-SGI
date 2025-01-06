import * as THREE from 'three';

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
        this.track = this.createTrack()
        this.points = []
        this.prevPoint = null
        this.nextPoint = null
        this.crossedPoints =0

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

        this.points = this.path.getPoints(100)
        this.prevPoint =0
        this.nextPoint = 1
        let lineGeometry = new THREE.BufferGeometry().setFromPoints(this.points);
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
                console.log("Error in coalition")
            }
            
        }
        return true
    
    }





}

export default MyTrack ;

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
        this.path.points = this.path.points.map(point => point.multiplyScalar(this.width));

        this.segments = segments
        this.track = this.createTrack()

    }

    /**
     * Creates the track
     */
    createTrack() {

        const texture = new THREE.TextureLoader().load("../textures/road.jpg");
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

        this.curve = new THREE.Group();
    
        this.mesh.visible = this.showMesh;
    
        this.curve.add(this.mesh);
    
        this.curve.scale.set(1, 0.2, 1);
        
        return this.curve;
    }



}

export { MyTrack };

import * as THREE from 'three';

class MyRoute  {

    constructor(width, starting_position, balloon_number = 1) {
        this.width = width
        this.starting_position = starting_position.multiplyScalar(this.width)
        this.balloon_number = balloon_number
        this.route = this.createRoute(balloon_number)
        
        this.visualLine = this.createLine()
    }

    createRoute(balloon_number) {

        switch(balloon_number) {
            case 1:
                return this.createRoute1()
            case 2:
                return this.createRoute2()
            case 3:
                return this.createRoute3()
            default:
                return this.createRoute3()
        }

    }

    // Follows the same pattern as MyTrack.js. It's like a "easy" mode of MyTrack.js
    createRoute1() {
        let points = [
            new THREE.Vector3(-5, 0, -10), 
            new THREE.Vector3(3, 0, -10),  
            new THREE.Vector3(3, 0, -3),     
            new THREE.Vector3(-2, 0, -3),  
            new THREE.Vector3(-2, 0, 3),   
            new THREE.Vector3(5, 0, 3),    
            new THREE.Vector3(5, 0, 10),   
            new THREE.Vector3(-5, 0, 10) 
        ]

        points = points.map(point => point.multiplyScalar(this.width));

        let finalPoints = [this.starting_position, ...points, this.starting_position];

        return finalPoints

    }

    // Improved path, cutting curves but dodging obstacles
    createRoute2() {

        let points = [
            new THREE.Vector3(-5.5, 0, -6),
            new THREE.Vector3(-5.5, 0, -8),
            new THREE.Vector3(-5, 0, -9),
            new THREE.Vector3(-4, 0, -10),
            new THREE.Vector3(-2.5, 0, -10.5),

            new THREE.Vector3(0.5, 0, -10),
            new THREE.Vector3(2, 0, -9.3),
            new THREE.Vector3(3, 0, -8),
            new THREE.Vector3(3.5, 0, -6),
            new THREE.Vector3(3, 0, -4.5),
            new THREE.Vector3(2.2, 0, -3),
            new THREE.Vector3(0.5, 0, -3),

            new THREE.Vector3(-1.6, 0, -2.5),
            new THREE.Vector3(-2.2, 0, -1),
            new THREE.Vector3(-2.2, 0, 0),
            new THREE.Vector3(-1.6, 0, 2),
            new THREE.Vector3(0, 0, 2.5),
            
            new THREE.Vector3(3, 0, 2.5),
            new THREE.Vector3(4, 0, 2.7),
            new THREE.Vector3(5, 0, 4),
            new THREE.Vector3(5.5, 0, 5),
            new THREE.Vector3(5.5, 0, 6),
            new THREE.Vector3(5.2, 0, 7),
            new THREE.Vector3(4.4, 0, 8.7),
            new THREE.Vector3(3, 0, 9.7),
            new THREE.Vector3(1, 0, 10.3),
            
            new THREE.Vector3(-1, 0, 10),
            new THREE.Vector3(-3, 0, 10),
            new THREE.Vector3(-4.5, 0, 9),
            new THREE.Vector3(-5, 0, 8)
            
            
        ]
        
        points = points.map(point => point.multiplyScalar(this.width));

        let finalPoints = [this.starting_position, ...points, this.starting_position];

        return finalPoints

    }

    // Follows the path presented in moodle
    createRoute3() {

        let points = [
            new THREE.Vector3(-5, 0, -6),
            new THREE.Vector3(-5, 0, -8),
            new THREE.Vector3(-4.5, 0, -9),
            new THREE.Vector3(-4, 0, -9.5),
            new THREE.Vector3(-2.5, 0, -10),

            new THREE.Vector3(0.5, 0, -10),
            new THREE.Vector3(2, 0, -9.3),
            new THREE.Vector3(3, 0, -8),
            new THREE.Vector3(3.5, 0, -6),
            new THREE.Vector3(3, 0, -4.5),
            new THREE.Vector3(2.2, 0, -3),
            new THREE.Vector3(0.5, 0, -3),

            new THREE.Vector3(-1.6, 0, -2.5),
            new THREE.Vector3(-2.2, 0, -1),
            new THREE.Vector3(-2.2, 0, 0),
            new THREE.Vector3(-1.6, 0, 2),
            new THREE.Vector3(0, 0, 2.5),
            
            new THREE.Vector3(3, 0, 2.5),
            new THREE.Vector3(4, 0, 2.7),
            new THREE.Vector3(5, 0, 4),
            new THREE.Vector3(5.5, 0, 5),
            new THREE.Vector3(5.5, 0, 6),
            new THREE.Vector3(5.2, 0, 7),
            new THREE.Vector3(4.4, 0, 8.7),
            new THREE.Vector3(3, 0, 9.7),
            
            new THREE.Vector3(-1, 0, 10),
            new THREE.Vector3(-3, 0, 10),
            new THREE.Vector3(-4.5, 0, 9),
            new THREE.Vector3(-5, 0, 8)
            
        ]

        points = points.map(point => point.multiplyScalar(this.width));

        let finalPoints = [this.starting_position, ...points, this.starting_position];

        console.log(finalPoints)

        return finalPoints

    }

    createLine() {

        let material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        
        let curve = new THREE.CatmullRomCurve3(this.route);
        //let points = curve.getPoints(50);
        let points = this.route;
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let line = new THREE.Line(geometry, material);

        let group = new THREE.Group();
        
        points.forEach(point => {
            let sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
            let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.copy(point);
            group.add(sphere);
        });

        console.log(group.children)

        group.add(line);

        group.position.y = 5

        return group;


    }


}

export { MyRoute };

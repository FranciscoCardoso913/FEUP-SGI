import * as THREE from 'three';

export class MyPrimitive{

    constructor(app) {
        this.app = app
    }

    buildPlane() {
        let planePrimitiveMaterial = new THREE.MeshPhongMaterial({ color: "#9B673c",
        specular: "#000000", emissive: "#000000", shininess: 90 })

        let planePrimitive = new THREE.PlaneGeometry( 5, 5); 
        this.planePrimitiveMesh = new THREE.Mesh( planePrimitive, planePrimitiveMaterial );
        this.planePrimitiveMesh.rotation.x = -Math.PI / 2;
        this.planePrimitiveMesh.position.y = 3;
        this.planePrimitiveMesh.scale.set(1,1,1);
        this.app.scene.add(this.planePrimitiveMesh);
    }

    buildCircle(thetaMult=1) {
        let circleMaterial = new THREE.MeshPhongMaterial({ color: "#ff00ff",
        specular: "#000000", emissive: "#000000", shininess: 90 })

        let circle = new THREE.CircleGeometry( 2, 32, 0, Math.PI * 2 * thetaMult);
        this.circleMesh = new THREE.Mesh( circle, circleMaterial );
        this.circleMesh.position.y = 4;
        this.circleMesh.rotation.x = -Math.PI / 2;
        
        this.app.scene.add( this.circleMesh );
    }

    buildSphere(thetaMult=1, phiMult=1, position) {
        let shpereMaterial = new THREE.MeshPhongMaterial({
            color: "#07aadd",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        let sphere = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2 * phiMult, 0, Math.PI * thetaMult);
        this.sphereMesh = new THREE.Mesh(sphere, shpereMaterial); 
        this.sphereMesh.position.x = position.x;
        this.sphereMesh.position.y = position.y;
        
        this.app.scene.add(this.sphereMesh);

    }

    buildCylinder(thetaMult=1, position) {
        
        let cylinderMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff00",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        let cylinder = new THREE.CylinderGeometry(2, 2, 3, 32, 32, false, 0, Math.PI * 2 * thetaMult);
        this.cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);
        this.cylinderMesh.position.x = position.x;
        this.cylinderMesh.position.y = position.y;

        this.app.scene.add(this.cylinderMesh);
    }

    buildCone(thetaMult=1, position){
        let coneMaterial = new THREE.MeshPhongMaterial({
            color: "#C58B93",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        let cone = new THREE.ConeGeometry(2,2,32,32,false,0,Math.PI *2 * thetaMult);
        this.coneMesh = new THREE.Mesh(cone, coneMaterial);
        this.coneMesh.position.x = position.x;
        this.coneMesh.position.y = position.y;

        this.app.scene.add(this.coneMesh);
    }

    buildPolyhedron() {
        let polyhedronMaterial = new THREE.MeshPhongMaterial({
            color: "#FFFFFF",
            specular: "#000000",
            emissive: "#FFFFFF",
            shininess: 90
        });

        let vertices = [
            1, 1, 1,   // 0
        -1, 1, 1,   // 1
        -1, -1, 1,  // 2
            1, -1, 1,  // 3
            1, 1, -1,  // 4
        -1, 1, -1,  // 5
        -1, -1, -1, // 6
            1, -1, -1  // 7
        ];

        let indices = [
            // FRONT
            0, 1, 2,
            0, 2, 3,

            // BACK
            4, 6, 5,
            4, 7, 6,

            // TOP
            4, 5, 1,
            4, 1, 0,

            // BOTTOM
            3, 2, 6,
            3, 6, 7,

            // RIGHT
            4, 0, 3,
            4, 3, 7,

            // LEFT
            1, 5, 6,
            1, 6, 2
        ];

        let polyhedron = new THREE.PolyhedronGeometry(vertices, indices, 1, 0);

        let polyhedronMesh = new THREE.Mesh(polyhedron, polyhedronMaterial);
        polyhedronMesh.position.y = 16; 
        this.app.scene.add(polyhedronMesh);
    }
}
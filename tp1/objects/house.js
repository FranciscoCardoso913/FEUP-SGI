import * as THREE from 'three';

export class House{

    constructor(app, widthx =10 ,widthy=10, height=8, wallsColor ='#ffffff', cellingColor = '#ffffff', floorColor = '#9B673c') {
        this.app = app;
        this.widthx = widthx;
        this.height = height;
        this.widthy = widthy; 
        this.wallsColor = wallsColor;
        this.cellingColor = cellingColor;
        this.floorColor = floorColor;
        this.init()
    }
    init(){
        this.walls()
        this.celling()
        this.floor()
    }

    walls(){
        let wallMaterial = new THREE.MeshPhongMaterial({ color: this.wallsColor, 
            specular: "#000000", emissive: "#000000", shininess: 90 })
        
        let wall = new THREE.PlaneGeometry( this.widthy, this.height); // right 
        let wall2 = new THREE.PlaneGeometry( this.widthx, this.height); // front 
        let wall3 = new THREE.PlaneGeometry( this.widthy, this.height); // left 
        let wall4 = new THREE.PlaneGeometry( this.widthx, this.height); // back

        let wallMesh = new THREE.Mesh( wall, wallMaterial );
        let wallMesh2 = new THREE.Mesh( wall2, wallMaterial );
        let wallMesh3 = new THREE.Mesh( wall3, wallMaterial );
        let wallMesh4 = new THREE.Mesh( wall4, wallMaterial );

        wallMesh.position.set(0,this.height/2,-this.widthx/2)
        wallMesh2.position.set(-this.widthy/2,this.height/2,0)
        wallMesh3.position.set(0,this.height/2,this.widthx/2)
        wallMesh4.position.set(this.widthy/2,this.height/2,0)

        
        wallMesh2.rotation.y = Math.PI / 2;
        wallMesh3.rotation.y = -Math.PI ;
        wallMesh4.rotation.y = -Math.PI/2 ;

        this.app.scene.add(wallMesh);
        this.app.scene.add(wallMesh2);
        this.app.scene.add(wallMesh3);
        this.app.scene.add(wallMesh4);
    }

    celling (){
        let planePrimitiveMaterial = new THREE.MeshPhongMaterial({ color: this.cellingColor,
            specular: "#000000", emissive: "#000000", shininess: 90 })

            let planePrimitive = new THREE.PlaneGeometry( this.widthx, this.widthy); 
            let planePrimitiveMesh = new THREE.Mesh( planePrimitive, planePrimitiveMaterial );
            planePrimitiveMesh.rotation.x = Math.PI / 2;
            planePrimitiveMesh.position.y = this.height;
            this.app.scene.add(planePrimitiveMesh);
    }
    floor(){
        let planePrimitiveMaterial = new THREE.MeshPhongMaterial({ color: this.floorColor,
            specular: "#000000", emissive: "#000000", shininess: 90 })

            let planePrimitive = new THREE.PlaneGeometry( this.widthx, this.widthy); 
            let planePrimitiveMesh = new THREE.Mesh( planePrimitive, planePrimitiveMaterial );
            planePrimitiveMesh.rotation.x = -Math.PI / 2;
            
            this.app.scene.add(planePrimitiveMesh);
    }
}
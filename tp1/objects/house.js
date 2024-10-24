import * as THREE from 'three';

export class House{

    constructor(app, widthx=10 ,widthy=10, height=8, wallsColor ='#ffffff', cellingColor = '#ffffff', floorColor = '#9B673c') {
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
        let wallMaterial = new THREE.MeshPhongMaterial({ 
            color: this.wallsColor,
            diffuse: "#ff00ff",
            shininess: 90 })
        
        let wall = new THREE.PlaneGeometry( this.widthy, this.height); // right 
        let wall2 = new THREE.PlaneGeometry( this.widthx, this.height); // front 
        let wall3 = new THREE.PlaneGeometry( this.widthy, this.height); // left 
        let wall4 = new THREE.PlaneGeometry( this.widthx, this.height); // back

        this.wallMesh = new THREE.Mesh( wall, wallMaterial );
        this.wallMesh2 = new THREE.Mesh( wall2, wallMaterial );
        this.wallMesh3 = new THREE.Mesh( wall3, wallMaterial );
        this.wallMesh4 = new THREE.Mesh( wall4, wallMaterial );

        this.wallMesh.position.set(0,this.height/2,-this.widthx/2)
        this.wallMesh2.position.set(-this.widthy/2,this.height/2,0)
        this.wallMesh3.position.set(0,this.height/2,this.widthx/2)
        this.wallMesh4.position.set(this.widthy/2,this.height/2,0)

        
        this.wallMesh2.rotation.y = Math.PI / 2;
        this.wallMesh3.rotation.y = -Math.PI ;
        this.wallMesh4.rotation.y = -Math.PI/2 ;
    }

    celling (){
        let planePrimitiveMaterial = new THREE.MeshPhongMaterial({ color: this.cellingColor,
            specular: "#000000", emissive: "#000000", shininess: 90 })

            let planePrimitive = new THREE.PlaneGeometry( this.widthx, this.widthy); 
            this.cellingMesh = new THREE.Mesh( planePrimitive, planePrimitiveMaterial );
            this.cellingMesh.rotation.x = Math.PI / 2;
            this.cellingMesh.position.y = this.height;
    }
    floor(){
        let planePrimitiveMaterial = new THREE.MeshPhongMaterial({ color: this.floorColor,
            specular: "#000000", emissive: "#000000", shininess: 90 })

            let planePrimitive = new THREE.PlaneGeometry( this.widthx, this.widthy); 
            this.floorMesh = new THREE.Mesh( planePrimitive, planePrimitiveMaterial );
            this.floorMesh.rotation.x = -Math.PI / 2;
            
    }

    enable(){
        this.app.scene.add(this.wallMesh);
        this.app.scene.add(this.wallMesh2);
        this.app.scene.add(this.wallMesh3);
        this.app.scene.add(this.wallMesh4);
        this.app.scene.add(this.cellingMesh);
        this.app.scene.add(this.floorMesh);
    }

    disable(){
        this.app.scene.remove(this.wallMesh);
        this.app.scene.remove(this.wallMesh2);
        this.app.scene.remove(this.wallMesh3);
        this.app.scene.remove(this.wallMesh4);
        this.app.scene.remove(this.cellingMesh);
        this.app.scene.remove(this.floorMesh);
    }
}
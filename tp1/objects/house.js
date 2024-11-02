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
        this.house = new THREE.Group();

        this.init()
    }

    /**
     * Initialize the house by creating the walls, celling, floor, and window
     */
    init(){
        this.walls()
        this.celling()
        this.floor()
        this.window()

        this.house.receiveShadow = true;
    }


    window(){

        let windowTexture = new THREE.TextureLoader().load( 'textures/dark_wood.jpg' );
        windowTexture.wrapS = THREE.MirroredRepeatWrapping;
        windowTexture.wrapT = THREE.MirroredRepeatWrapping;
        windowTexture.repeat.set( 2, 3 );
        let windowMaterial = new THREE.MeshPhongMaterial({
            map: windowTexture
        });

        // creating the geometries
        let strip1 = new THREE.BoxGeometry(1,this.height/3+1,1) //left
        let strip2 = new THREE.BoxGeometry(1,this.height/3+1,1) //right
        let strip3 = new THREE.BoxGeometry(this.widthx/3,1,1) //top
        let strip4 = new THREE.BoxGeometry(this.widthx/3,1,1) //bottom
        let middleStrip1 = new THREE.BoxGeometry(1,this.height/3,1) //middle horizontal
        let middleStrip2 = new THREE.BoxGeometry(this.widthx/3,1,1) //middle vertical

        // creating the meshes
        this.stripMesh1 = new THREE.Mesh(strip1, windowMaterial);
        this.stripMesh2 = new THREE.Mesh(strip2, windowMaterial);
        this.stripMesh3 = new THREE.Mesh(strip3, windowMaterial);
        this.stripMesh4 = new THREE.Mesh(strip4, windowMaterial);
        this.middleStripMesh1 = new THREE.Mesh(middleStrip1, windowMaterial);
        this.middleStripMesh2 = new THREE.Mesh(middleStrip2, windowMaterial);

        // adding to the group
        this.house.add(this.stripMesh1);
        this.house.add(this.stripMesh2);
        this.house.add(this.stripMesh3);
        this.house.add(this.stripMesh4);
        this.house.add(this.middleStripMesh1);
        this.house.add(this.middleStripMesh2);

        // the window casts shadows
        this.stripMesh1.castShadow = true;
        this.stripMesh2.castShadow = true;
        this.stripMesh3.castShadow = true;
        this.stripMesh4.castShadow = true;
        this.middleStripMesh1.castShadow = true;
        this.middleStripMesh2.castShadow = true;

        // window properties
        this.stripMesh3.rotation.y = Math.PI/2;
        this.stripMesh4.rotation.y = Math.PI/2;
        this.middleStripMesh2.rotation.y = Math.PI/2;
        this.stripMesh1.position.set(this.widthy/2,this.height/2,-this.widthx/6);
        this.stripMesh2.position.set(this.widthy/2,this.height/2,this.widthx/6);
        this.stripMesh3.position.set(this.widthy/2,this.height/3,0);
        this.stripMesh4.position.set(this.widthy/2,2*this.height/3,0);
        this.middleStripMesh1.position.set(this.widthy/2,this.height/2,0);
        this.middleStripMesh2.position.set(this.widthy/2,this.height/2,0);
    
    }

    /**
     * Create the walls of the house
     * One wall has a hole for the window, and it is divided into 4 parts.
     * The other walls are simple planes
     */
    walls(){

        // Preparing textures
        let wallTexture = new THREE.TextureLoader().load( 'textures/wall.jpg' );
        wallTexture.wrapS = THREE.MirroredRepeatWrapping;
        wallTexture.wrapT = THREE.MirroredRepeatWrapping;
        wallTexture.repeat.set( 2, 3 );

        let yPartTexture = new THREE.TextureLoader().load( 'textures/wall.jpg' );
        yPartTexture.wrapS = THREE.MirroredRepeatWrapping;
        yPartTexture.repeat.set( 2/3, 1 );
        yPartTexture.offset.set(-1,0);

        let xPartTexture = new THREE.TextureLoader().load( 'textures/wall.jpg' );
        xPartTexture.wrapT = THREE.MirroredRepeatWrapping;
        xPartTexture.repeat.set(2/3,3)


        // Preparing materials
        let wallMaterial = new THREE.MeshPhongMaterial({ 
            color: this.wallsColor,
            map: wallTexture
         })

        let yPartMaterial = new THREE.MeshPhongMaterial({
            color: this.wallsColor,
            map: yPartTexture
         })
    
        let xPartMaterial = new THREE.MeshPhongMaterial({
            color: this.wallsColor,
            map: xPartTexture
         })
    
         
        // creating the geometries
        let wall = new THREE.PlaneGeometry( this.widthy, this.height); // right 
        let wall2 = new THREE.PlaneGeometry( this.widthx, this.height); // front 
        let wall3 = new THREE.PlaneGeometry( this.widthy, this.height); // left 
        let wall4_1 = new THREE.PlaneGeometry( this.widthx/3, this.height); // back 1
        let wall4_2 = new THREE.PlaneGeometry( this.widthx/3, this.height); // back 2
        let wall4_3 = new THREE.PlaneGeometry( this.widthx/3, this.height/3); // back 3
        let wall4_4 = new THREE.PlaneGeometry( this.widthx/3, this.height/3); // back 4


        // creating the meshes
        this.wallMesh = new THREE.Mesh( wall, wallMaterial );
        this.wallMesh2 = new THREE.Mesh( wall2, wallMaterial );
        this.wallMesh3 = new THREE.Mesh( wall3, wallMaterial );
        this.wallMesh4_1 = new THREE.Mesh( wall4_1, xPartMaterial );
        this.wallMesh4_2 = new THREE.Mesh( wall4_2, xPartMaterial );
        this.wallMesh4_3 = new THREE.Mesh( wall4_3, yPartMaterial );
        this.wallMesh4_4 = new THREE.Mesh( wall4_4, yPartMaterial );


        // adding to the group
        this.house.add(this.wallMesh);
        this.house.add(this.wallMesh2);
        this.house.add(this.wallMesh3);
        this.house.add(this.wallMesh4_1);
        this.house.add(this.wallMesh4_2);
        this.house.add(this.wallMesh4_3);
        this.house.add(this.wallMesh4_4);


        // Walls properties
        this.wallMesh.position.set(0,this.height/2,-this.widthx/2);
        this.wallMesh2.position.set(-this.widthy/2,this.height/2,0);
        this.wallMesh3.position.set(0,this.height/2,this.widthx/2);
        this.wallMesh4_1.position.set(this.widthy/2,this.height/2,this.widthx/3);
        this.wallMesh4_2.position.set(this.widthy/2,this.height/2,-this.widthx/3);
        this.wallMesh4_3.position.set(this.widthy/2,this.height/6, 0);
        this.wallMesh4_4.position.set(this.widthy/2,5*this.height/6, 0);
        
        this.wallMesh2.rotation.y = Math.PI/2;
        this.wallMesh3.rotation.y = -Math.PI;
        this.wallMesh4_1.rotation.y = -Math.PI/2;
        this.wallMesh4_2.rotation.y = -Math.PI/2;
        this.wallMesh4_3.rotation.y = -Math.PI/2;
        this.wallMesh4_4.rotation.y = -Math.PI/2;   
        
    }

    /**
     * Create the celling of the house
     * 
     */
    celling (){

        let cellingTexture = new THREE.TextureLoader().load( 'textures/floor.jpg' );
        cellingTexture.wrapS = THREE.RepeatWrapping;
        cellingTexture.wrapT = THREE.RepeatWrapping;
        cellingTexture.repeat.set( 5, 5 );
        cellingTexture.offset.set( 0.5, 0.5 );

        let planePrimitiveMaterial = new THREE.MeshPhongMaterial({ 
            color: this.cellingColor,
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
            map: cellingTexture
        })

        let planePrimitive = new THREE.PlaneGeometry( this.widthx, this.widthy); 
        this.cellingMesh = new THREE.Mesh( planePrimitive, planePrimitiveMaterial );
        this.cellingMesh.rotation.x = Math.PI / 2;
        this.cellingMesh.position.y = this.height;

        this.house.add(this.cellingMesh);
    }

    /**
     * Create the floor of the house
     */
    floor(){

        let floorTexture = new THREE.TextureLoader().load( 'textures/floor.jpg' );
        floorTexture.wrapS = THREE.MirroredRepeatWrapping;
        floorTexture.wrapT = THREE.MirroredRepeatWrapping;
        floorTexture.repeat.set( 5, 5 );

        let planePrimitiveMaterial = new THREE.MeshPhongMaterial({
            color: this.floorColor,
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
            map: floorTexture
         })

        let planePrimitive = new THREE.PlaneGeometry( this.widthx, this.widthy); 
        this.floorMesh = new THREE.Mesh( planePrimitive, planePrimitiveMaterial );
        this.floorMesh.receiveShadow = true;
        this.floorMesh.rotation.x = -Math.PI / 2;  

        this.house.add(this.floorMesh);
            
    }



    enable(){
        this.app.scene.add(this.house);
    }

    disable(){
        this.app.scene.remove(this.house);
    }
}
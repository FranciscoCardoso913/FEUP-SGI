import * as THREE from 'three';

export class Table{
    /**
     * 
     * @param {*} scene 
     * @param {float} width width of the table
     * @param {float} length length of the table
     * @param {float} tableHeight height of the table
     * @param {float} legHeight height of the table legs
     * @param {float} legRadius radius of the table leg
     * @param {THREE.Vector3} position position of the table
     * @param {string} topColor color of the top of the table
     * @param {string} legColor color of the legs of the table
     */
    constructor(scene, width =10 ,length=10, tableHeight=0.5, legHeight=8, legRadius=2, position= new THREE.Vector3(0,0,0), topColor='#ce9c69', legColor='#ce9c69') {
        this.scene = scene;
        this.width = width;
        this.length = length;
        this.tableHeight = tableHeight;
        this.legHeight = legHeight;
        this.legRadius = legRadius; 
        this.topColor = topColor;
        this.legColor = legColor;
        this.position= position;
        this.init()
    }
    /**
     * Initializes Table object
     */
    init(){
        this.texture = new THREE.TextureLoader().load('textures/dark_wood.jpg');
        this.texture.wrapT = THREE.MirroredRepeatWrapping;
        this.texture.repeat.set( 2, 2 );
        this.legs()
        this.top()
        this.topMesh.position.add(this.position)
    }
    /**
     * Creates table legs
     */
    legs(){



        let legMaterial = new THREE.MeshPhongMaterial({ 
            color: this.legColor, 
            specular: "#7e5c39",
            shininess: 10,
            map: this.texture
        })

        let leg1 = new THREE.CylinderGeometry( this.legRadius, this.legRadius, this.legHeight );
        let leg2 = new THREE.CylinderGeometry( this.legRadius, this.legRadius, this.legHeight );
        let leg3 = new THREE.CylinderGeometry( this.legRadius, this.legRadius, this.legHeight );
        let leg4 = new THREE.CylinderGeometry( this.legRadius, this.legRadius, this.legHeight );

        this.legMesh1 = new THREE.Mesh( leg1, legMaterial );
        this.legMesh2 = new THREE.Mesh( leg2, legMaterial );
        this.legMesh3 = new THREE.Mesh( leg3, legMaterial );
        this.legMesh4 = new THREE.Mesh( leg4, legMaterial );

        this.legMesh1.castShadow = this.legMesh1.receiveShadow = true;
        this.legMesh2.castShadow = this.legMesh2.receiveShadow = true;
        this.legMesh3.castShadow = this.legMesh3.receiveShadow = true;
        this.legMesh4.castShadow = this.legMesh4.receiveShadow = true;

        this.legMesh1.position.set(-this.width/2.5,-this.legHeight/2,-this.length/2.5);
        this.legMesh2.position.set(-this.width/2.5,-this.legHeight/2,this.length/2.5);
        this.legMesh3.position.set(this.width/2.5,-this.legHeight/2,-this.length/2.5);
        this.legMesh4.position.set(this.width/2.5,-this.legHeight/2,this.length/2.5);      

    }
    /**
     * Creates top table
     */
    top(){


        let topMaterial = new THREE.MeshPhongMaterial({ 
            color: this.topColor, 
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
            map: this.texture 
        });

        let top = new THREE.BoxGeometry( this.width, this.tableHeight, this.length); 
        this.topMesh = new THREE.Mesh( top, topMaterial );
        this.topMesh.castShadow = this.topMesh.receiveShadow = true;
        this.topMesh.position.y = this.legHeight;

        this.topMesh.add(this.legMesh1);
        this.topMesh.add(this.legMesh2);
        this.topMesh.add(this.legMesh3);
        this.topMesh.add(this.legMesh4);

    }
    /**
    * Enables the table object in the scene
    */
    enable(){
        this.scene.add(this.topMesh);
    }
    /**
    * Disables the table object in the scene
    */
    disable(){
        this.scene.remove(this.topMesh);
    }


    

}
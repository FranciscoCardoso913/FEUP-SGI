import * as THREE from 'three';

export class Book{

    constructor(scene,builder, color= 0x009933, position = new THREE.Vector3(0,0,0), anglex=0, angley=0,anglez=0) {
        this.scene = scene
        this.builder = builder
        this.position = position
        this.color = color
        this.angley = angley
        this.anglex = anglex
        this.anglez=anglez
        this.book = new THREE.Group()
        this.init()
    }

    /**
     * Initializes the book object 
     */
    init() {

        // Defining Mesh Materials for the book cover and pages
        this.samplesU = 20
        this.samplesV = 20  
        let map =new THREE.TextureLoader().load( 'textures/book.jpg' );
        this.coverMaterial = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide, color: this.color} );
        
        map =new THREE.TextureLoader().load( 'textures/book.jpg' );
        this.pageMaterial = new THREE.MeshLambertMaterial( { map: map, color: 0xfff5d3} );
    
        // Create group for the book and call the drawCover and drawPages functions
        this.book.add(this.drawCover())
        this.book.add(this.drawPages())

        // Set the position and rotation of the book
        this.book.position.add(this.position)
        this.book.rotateZ(this.anglez)
        this.book.rotateY(this.angley)
        this.book.rotateX(this.anglex)
        
    }

    /**
     * Creates a mesh representing the pages of the book
     * @returns {THREE.Mesh} - Returns a mesh representing the pages of the book
     */
    drawPages(){
        const geometry = new THREE.BoxGeometry(1.3,2.1,0.3)
        const pages = new THREE.Mesh(geometry, this.pageMaterial)
        pages.position.add(new THREE.Vector3(0.8,0.25,1.3))
        pages.rotateX(-Math.PI/2)
        pages.receiveShadow = pages.castShadow = true
        return pages
    }

    /**
     * 
     * @returns {THREE.Mesh} - Returns a mesh representing the cover of the book
     */
    drawCover(){

        // declare local variables
        let controlPoints;
        let surfaceData;

        let orderU = 1
        let orderV = 4

        // build nurb #1
        controlPoints =
        [ // U = 0
            [ // V = ​​0..3;
                [ 0, 0.4, 0.0, 1 ],
                [ 2, 0.6, 0, 1 ],
                [ 1.8,  0.25, 0, 1 ],
                [ 2,  -0.1, 0, 1 ],
                [ 0,  0.1, 0, 1 ]
            ],

            // U = 1
            [ // V = ​​0..3;
                [ 0, 0.4, 2.5, 1 ],
                [ 2, 0.6, 2.5, 1 ],
                [ 1.8,  0.25, 2.5, 1 ],
                [ 2,  -0.1, 2.5, 1 ],
                [ 0,  0.1, 2.5, 1 ]
            ]
        ]

        surfaceData = this.builder.build(
            controlPoints,
            orderU, orderV,
            this.samplesU, this.samplesV,
            this.material);
  
        let mesh = new THREE.Mesh( surfaceData, this.coverMaterial );
        mesh.receiveShadow = mesh.castShadow = true
        return mesh
    }

    /**
     * Enables the book object in the scene
     */
    enable(){
        this.scene.add( this.book )
    }

    /**
     * Disables the book object in the scene
     */
    disable(){
        this.scene.remove(this.book)
    }

    /**
     * @returns {THREE.Group} - Returns the book object
     */
    getMesh(){
        return this.book
    }

        
}
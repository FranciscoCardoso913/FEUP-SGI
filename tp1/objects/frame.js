import * as THREE from 'three';

export class Frame{

    constructor(app, imageTexture, width = 10, height = 15, depth = 2, frameColor = 'b2b48c', position, rotation, frameTexture = null) {
        this.app = app;
        this.imageTexture = imageTexture;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.frameColor = frameColor;
        this.frameTexture = frameTexture;
        this.position = position;
        this.rotation = rotation;

        this.frameGroup = new THREE.Group();
        this.init();
    }

    /**
     * Initialize the frame by creating the base, left, right, top, and bottom meshes
     */
    init(){

        // Load the frame texture if not provided
        if (this.frameTexture === null){
            this.frameTexture = new THREE.TextureLoader().load('textures/dark_wood.jpg');
            this.frameTexture.wrapS = THREE.MirroredRepeatWrapping;
            this.frameTexture.wrapT = THREE.MirroredRepeatWrapping; 
        }

        // Create Materials
        this.frameMaterial = new THREE.MeshPhongMaterial({
            color : this.frameColor,
            specular: this.frameColor,
            shininess: 90, 
            map : this.frameTexture
        })
        this.imageMaterial = new THREE.MeshLambertMaterial({
            map : this.imageTexture
        })


        // Create geometries
        this.base = new THREE.PlaneGeometry(this.width, this.height);
        this.left = new THREE.BoxGeometry(this.depth, this.height+this.depth*2, this.depth);
        this.right = new THREE.BoxGeometry(this.depth, this.height+this.depth*2, this.depth);
        this.top = new THREE.BoxGeometry(this.width+this.depth*2, this.depth, this.depth);
        this.bottom = new THREE.BoxGeometry(this.width+this.depth*2, this.depth, this.depth);

        // Create meshes
        this.baseMesh = new THREE.Mesh(this.base, this.imageMaterial);
        this.leftMesh = new THREE.Mesh(this.left, this.frameMaterial);
        this.rightMesh = new THREE.Mesh(this.right, this.frameMaterial);
        this.topMesh = new THREE.Mesh(this.top, this.frameMaterial);
        this.bottomMesh = new THREE.Mesh(this.bottom, this.frameMaterial);

        // Meshes properties
        this.bottomMesh.position.y = -this.height/2-this.depth/2;
        this.topMesh.position.y = this.height/2+this.depth/2;
        this.leftMesh.position.x = -this.width/2-this.depth/2;
        this.rightMesh.position.x = this.width/2+this.depth/2;


        // Add meshes to the group
        this.frameGroup.add(this.baseMesh);
        this.frameGroup.add(this.leftMesh);
        this.frameGroup.add(this.rightMesh);
        this.frameGroup.add(this.topMesh);
        this.frameGroup.add(this.bottomMesh);

        // Set position and rotation
        this.frameGroup.position.copy(this.position);
        this.frameGroup.rotateX(this.rotation.x);
        this.frameGroup.rotateY(this.rotation.y);
        this.frameGroup.rotateZ(this.rotation.z);

    }

    /**
     * Enable the frame by adding it to the scene
     */
    enable() {
        this.app.scene.add(this.frameGroup);
    }

    /**
     * Disable the frame by removing it from the scene
     */
    disable() {
        this.app.scene.remove(this.frameGroup);
    }

    

}
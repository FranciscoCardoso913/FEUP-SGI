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
        this.init();
    }

    init(){

        if (this.frameTexture === null){
            this.frameTexture = new THREE.TextureLoader().load('textures/dark_wood.jpg');
            this.frameTexture.wrapS = THREE.MirroredRepeatWrapping;
            this.frameTexture.wrapT = THREE.MirroredRepeatWrapping; 
        }

        this.frameMaterial = new THREE.MeshPhongMaterial({
            color : this.frameColor,
            specular: this.frameColor,
            shininess: 90, 
            map : this.frameTexture
        })

        //this.imageTexture.

        this.imageMaterial = new THREE.MeshLambertMaterial({
            map : this.imageTexture
        })

        this.base = new THREE.PlaneGeometry(this.width, this.height);
        this.left = new THREE.BoxGeometry(this.depth, this.height+this.depth*2, this.depth);
        this.right = new THREE.BoxGeometry(this.depth, this.height+this.depth*2, this.depth);
        this.top = new THREE.BoxGeometry(this.width+this.depth*2, this.depth, this.depth);
        this.bottom = new THREE.BoxGeometry(this.width+this.depth*2, this.depth, this.depth);

        this.baseMesh = new THREE.Mesh(this.base, this.imageMaterial);
        this.leftMesh = new THREE.Mesh(this.left, this.frameMaterial);
        this.rightMesh = new THREE.Mesh(this.right, this.frameMaterial);
        this.topMesh = new THREE.Mesh(this.top, this.frameMaterial);
        this.bottomMesh = new THREE.Mesh(this.bottom, this.frameMaterial);

        this.bottomMesh.position.y = -this.height/2-this.depth/2;
        this.topMesh.position.y = this.height/2+this.depth/2;
        this.leftMesh.position.x = -this.width/2-this.depth/2;
        this.rightMesh.position.x = this.width/2+this.depth/2;

        this.baseMesh.add(this.leftMesh);
        this.baseMesh.add(this.rightMesh);
        this.baseMesh.add(this.topMesh);
        this.baseMesh.add(this.bottomMesh);

        this.baseMesh.position.set(this.position.x, this.position.y, this.position.z);
        this.baseMesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

    }

    enable() {
        this.app.scene.add(this.baseMesh);
    }

    disable() {
        this.app.scene.remove(this.baseMesh);
    }

    

}
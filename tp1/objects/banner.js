import * as THREE from 'three';

export class Banner{
    /**
     * 
     * @param {*} scene 
     * @param {THREE.Texture} imageTexture texture of the landscape
     * @param {THREE.Vector3} position position of the landscape
     * @param {THREE.Vector3} rotation rotation of the landscape
     */
    constructor(scene, imageTexture, position, rotation) {
        this.scene = scene;
        this.imageTexture = imageTexture;
        this.position = position;
        this.rotation = rotation;
        this.landscapeGroup = new THREE.Group()
        this.init();
    }
    /**
     * Initializes the Banner object
     */
    init(){
        this.imageTexture.colorSpace = THREE.SRGBColorSpace;
        this.BannerMaterial = new THREE.MeshPhongMaterial({
            shininess: 1,
            map: this.imageTexture,
        });

        this.banner = new THREE.PlaneGeometry(22, 5, 10, 3);

        this.bannerMesh = new THREE.Mesh(this.banner, this.BannerMaterial);
        this.bannerMesh.position.set(this.position.x, this.position.y, this.position.z);
        this.bannerMesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

    }
   /**
    * Enables the Banner object in the scene
    */
    enable() {
        this.scene.add(this.bannerMesh);
    }
   /**
    * Disables the Banner object in the scene
    */
    disable() {
        this.scene.remove(this.bannerMesh);
    }
    

}
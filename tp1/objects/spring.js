
import * as THREE from 'three';


class HelixCurve extends THREE.Curve {
    constructor(radius = 1, height = 10, coils = 10) {
      super();
      this.radius = radius; // Radius of the spring coil
      this.height = height; // Height (length) of the spring
      this.coils = coils;   // Number of coils in the spring
    }
  
    getPoint(t) {
      const angle = 2 * Math.PI * this.coils * t; // Coil rotation based on `t`
      const x = this.radius * Math.cos(angle);    // X position on circular path
      const y = this.radius * Math.sin(angle);    // Y position on circular path
      const z = this.height * t;                  // Z position for height of spring
      return new THREE.Vector3(x, y, z);
    }
  }

export class Spring{
    /**
    * 
    * @param {*} scene 
    * @param {new THREE.Vector3} position Position of the spring
    * @param {float} radius radius of the spring
    * @param {float} height hight of the spring
    * @param {int} coils number of circles the spring will make
    */
    constructor(scene, position = new THREE.Vector3(0,0,0), radius = 0.3, height = 1, coils = 7) {
        this.scene = scene
        this.radius = radius
        this.height = height
        this.coils = coils
        this.position = position
        this.init()
    }
    /**
     * Initializes the spring object
     */
    init() {
        
        // Create a new HelixCurve with the above parameters
        const helixCurve = new HelixCurve(this.radius, this.height, this.coils);
        
        // Create the TubeGeometry to wrap the curve path
        const tubeGeometry = new THREE.TubeGeometry(helixCurve, 300, 0.05, 8, false); // 0.1 is the tube radius
        const map =new THREE.TextureLoader().load( 'textures/spring.jpg' );
        map.colorSpace = THREE.SRGBColorSpace;

        this.material = new THREE.MeshLambertMaterial( { 
          map: map,
          transparent: true,
          opacity: 1
          } );
        this.spring = new THREE.Mesh(tubeGeometry, this.material);
        this.spring.castShadow = this.spring.receiveShadow = true;

        this.spring.position.add(this.position)
        this.spring.rotateX(-Math.PI/2)
    }
    /**
    * Enables the spring object in the scene
    */
    enable(){
        this.scene.add(this.spring)
    }
    /**
    * Disables the spring object in the scene
    */
    disable(){

      this.scene.remove( this.spring )
  }

}
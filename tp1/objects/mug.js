import * as THREE from 'three';


export class Mug{
    /**
     * 
     * @param {*} scene 
     * @param {*} builder builder to create curved surfaces
     * @param {THREE.Vector3} position Position of the mug
     * @param {float} angle Angle that the mug will rotate in y
     */
    constructor(scene,builder, position = new THREE.Vector3(0,0,0), angle=0)  {
        this.scene = scene
        this.builder = builder
        this.position = position
        this.angle = angle
        this.mug = new THREE.Group()
        this.init()
    }

    /**
     * Initializes the mug object
     */
    init() {

        this.samplesU = 20 
        this.samplesV = 20  
        let map =new THREE.TextureLoader().load( 'textures/mug.jpg' );
        map.colorSpace = THREE.SRGBColorSpace;
        this.mugMaterial = new THREE.MeshLambertMaterial( { map: map, color: 0xcccccc, side: THREE.DoubleSide} );

        map =new THREE.TextureLoader().load( 'textures/coffe.jpg' );
        this.coffeMaterial = new THREE.MeshLambertMaterial( { map: map, color: 0x6f4e37} );
       
        this.mug.add(this.drawMug())
        this.mug.add(this.drawHandle())
        this.mug.add(this.drawCoffe())

        this.mug.position.add(this.position)
        this.mug.rotateY(this.angle)
    }
    /**
     * Creates the mug
     * @returns {THREE.Mesh} The mug mesh
     */
    drawMug(){
        const geometry = new THREE.CylinderGeometry(0.5,0.5,1,32,1,true)
        const mug = new THREE.Mesh(geometry, this.mugMaterial)
        mug.castShadow = true
        mug.position.add(new THREE.Vector3(0,0.4,0))
        return mug
    }
    /**
     * Creates the coffe
     * @returns {THREE.Mesh} The coffe mesh
     */
    drawCoffe(){
        const geometry = new THREE.CircleGeometry(0.5,32)
        const coffe = new THREE.Mesh(geometry, this.coffeMaterial)
        coffe.position.add(new THREE.Vector3(0,0.7,0))
        coffe.rotateX(-Math.PI/2)
        return coffe
    }

    /**
     * Creates the handle of the mug
     * @returns {THREE.Mesh} The handle mesh
     */
    drawHandle(){
  
        const startPoint = new THREE.Vector3(0.46, 0.1, 0); // starting point
        const controlPoint = new THREE.Vector3(1, 0.7, 0); // first control point
        const endPoint = new THREE.Vector3(0.49, 0.8, 0); // first control point

        const bezierCurve = new THREE.QuadraticBezierCurve3(startPoint, controlPoint, endPoint);

        const tubeGeometry = new THREE.TubeGeometry(bezierCurve, 50, 0.1, 8, false);
        let handle = new THREE.Mesh(tubeGeometry, this.mugMaterial);
        handle.castShadow = true;

        return handle
    }
   /**
    * Enables the mug object in the scene
    */
    enable(){

        this.scene.add( this.mug )
    }
   /**
    * Disables the mug object in the scene
    */
    disable(){
        this.scene.remove(this.mug)
    }

        
}
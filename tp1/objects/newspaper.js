import * as THREE from 'three';

export class NewsPaper{
    /**
     * 
     * @param {*} scene 
     * @param {*} builder MyNurbsBuilder builder used to create the curved surfaces
     * @param {THREE.Vector3} position position of the newspaper
     * @param {int} anglex Angle that the NewsPaper will rotate in X
     * @param {int} angley Angle that the Nespaper will rotate in y
     */
    constructor(scene,builder, position = new THREE.Vector3(0,0,0), anglex=0, angley=0 ) {
        this.scene = scene
        this.builder = builder
        this.position = position
        this.anglex = anglex
        this.angley = angley
        this.init()
    }
    /**
     * Initializes the newspaper object
     */
    init() {

        this.samplesU = 20 // Number of samples used for U

        this.samplesV = 20  // Number of samples used for V
        
        const map =new THREE.TextureLoader().load( 'textures/newspaper.jpg' );
        map.colorSpace = THREE.SRGBColorSpace;
        this.material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide,} );

       
        this.newspaper = this.drawNewspaper() 
        this.newspaper.position.add(this.position)
        this.newspaper.rotateY(this.angley)
        this.newspaper.rotateX(this.anglex)
        
 
    }
    /**
     * Creates newspaper curved surface
     * @returns {THREE.Mesh} The newspaper
     */
    drawNewspaper(){
          // declare local variables

          let controlPoints;

          let surfaceData;
  
  
          let orderU = 2
  
          let orderV = 4
  
          // build nurb #1
  
          controlPoints =
          [ // U = 0
              [ // V = ​​0..4;
                  [ -2, -0.5, 0.0, 1 ],
                  [ -2.0, -1.0, 1.0, 1 ],
                  [ -2.0,  1.0, 1.0, 1 ],
                  [ -1.5,  0.0, -0.5, 1 ],
                  [ -1.5,  -0.4, 0.3, 1 ]
              ],
          // U = 1
              [ // V = ​​0..4
                  [ -0.5,  0, 0.0, 1 ],
                  [ 0.0, 0, 0.0, 1 ],
                  [ 0.0,  0, 0.0, 1 ],
                  [ 0.0,  0, 0.0, 1 ],
                  [ 0.0,  0, 0.0, 1 ]
              ],
          // U = 2
              [ // V = ​​0..4
                  [ 2, -0.25, 0.0, 1 ],
                  [ 2.0, -0.5, 1.0, 1 ],
                  [ 2.0,  0.5, 1.0, 1 ],
                  [ 2.0,  0.25, 0.0, 1 ],
                  [ 2.5,  -0.2, 0.0, 1 ]
              ]
       ]
          surfaceData = this.builder.build(controlPoints,
                        orderU, orderV, this.samplesU,
                        this.samplesV, this.material)  
          let mesh = new THREE.Mesh( surfaceData, this.material );
          mesh.receiveShadow = mesh.castShadow = true
          return mesh
    }
    /**
    * Enables the newspaper object in the scene
    */
    enable(){
        this.scene.add( this.newspaper )
    }
    /**
    * Disables the newspaper object in the scene
    */
    disable(){
        this.scene.remove( this.newspaper )
    }

        
}
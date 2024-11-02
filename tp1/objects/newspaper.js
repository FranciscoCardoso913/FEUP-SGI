import * as THREE from 'three';

export class NewsPaper{

    constructor(scene,builder, position = new THREE.Vector3(0,0,0), anglex=0, angley=0 ) {
        this.scene = scene
        this.builder = builder
        this.position = position
        this.anglex = anglex
        this.angley = angley
        this.init()
    }

    init() {

        this.samplesU = 20         // maximum defined in MyGuiInterface

        this.samplesV = 20  
        
        const map =new THREE.TextureLoader().load( 'textures/newspaper.jpg' );
        map.colorSpace = THREE.SRGBColorSpace;
        this.material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide,} );

       
        this.newspaper = this.drawNewspaper()
        this.newspaper.rotation.x = 0
 
        this.newspaper.rotation.y = 0
 
        this.newspaper.rotation.z = 0

 
        this.newspaper.position.add(this.position)
        this.newspaper.rotateY(this.angley)
        this.newspaper.rotateX(this.anglex)
        
 
    }

    drawNewspaper(){
          // declare local variables

          let controlPoints;

          let surfaceData;
  
  
          let orderU = 2
  
          let orderV = 4
  
          // build nurb #1
  
          controlPoints =
  
          [ // U = 0
  
              [ // V = ​​0..3;
  
                  [ -2, -0.5, 0.0, 1 ],
  
                  [ -2.0, -1.0, 1.0, 1 ],
  
                  [ -2.0,  1.0, 1.0, 1 ],
  
                  [ -1.5,  0.0, -0.5, 1 ],
  
                  [ -1.5,  -0.4, 0.3, 1 ]
  
              ],
  
          // U = 1
  
              [ // V = ​​0..3
  
                  [ -0.5,  0, 0.0, 1 ],
  
                  [ 0.0, 0, 0.0, 1 ],
  
                  [ 0.0,  0, 0.0, 1 ],
  
                  [ 0.0,  0, 0.0, 1 ],
  
                  [ 0.0,  0, 0.0, 1 ]  
  
              ],
  
          // U = 2
  
              [ // V = ​​0..3
  
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

    enable(){

        this.scene.add( this.newspaper )
    }

    disable(){

        this.scene.remove( this.newspaper )
    }

        
}
import * as THREE from 'three';

export class Paint{
    /**
     * 
     * @param {*} scene 
     * @param {THREE.Vector3} position position of the paint
     * @param {int} angle Angle that the Painting will rotate in y
     * @param {THREE.Vector3} scale Scale of the Paiting
     * @param {int} segments Numbers of segements used to draw a circle
     */
    constructor(scene ,position = new THREE.Vector3(0,0,0) , angle = 0, scale = new THREE.Vector3(0.2,0.2,1), segments = 20) {
        this.scene = scene
    
        this.position = position
        this.angle = angle
        this.scale = scale
        this.paint = new THREE.Group();
        this.segments = segments
        this.init()
    }
    /**
     * Initializes the paiting object
     */
    init() {
        const map =new THREE.TextureLoader().load( 'textures/book.jpg' );
        this.canvasMaterial = new THREE.MeshLambertMaterial( { map: map, color: 0xDDDDDD} );
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } )
        this.paint.add(this.canvas())
        this.paint.add(this.drawing())
        this.paint.scale.set(this.scale.x, this.scale.y, this.scale.z)
        this.paint.position.add(this.position)
        this.paint.rotateY(this.angle)
        
    }

    /**
     * Creates the canva object
     * @returns the canva
     */
    canvas(){
        const geometry = new THREE.BoxGeometry(23,15,0.1,5,5)
        const canvas = new THREE.Mesh(geometry, this.canvasMaterial)
        canvas.castShadow = true
        canvas.position.set(11.5,7.5,0)
        return canvas

    }
    /**
     * Creates the drawing
     * @returns the drawing
     */
    drawing(){
        this.numberOfSamples = this.segments
    
        let drawing = new THREE.Group()

        drawing.add(this.circle(3,0.5,new THREE.Vector3(6,3,0.1))) // Left  ½ circumference
        drawing.add(this.circle(3,0.5,new THREE.Vector3(16,3,0.1)))// Right  ½ circumference
        drawing.add(this.circle(4,0.25,new THREE.Vector3(15,3,0.1)))// Right Bottom ¼ circumference
        drawing.add(this.circle(4,0.25,new THREE.Vector3(11,7,0.1))) // Right Top ¼ circumference
        drawing.add(this.circle(8,0.5,new THREE.Vector3(11,3,0.1),Math.PI/2)) // Left ¼ circumference
        return drawing
    
    }
    /**
     * Creates a circumference using Curved Lines
     * @param {float} radius Radius of the circumference
     * @param {float} percentage percentage of the circumference drawn
     * @param {THREE.Vector3} position position fo the circumference
     * @param {float} starting_angle angle where the circumference will start being drawn
     * @returns the circumference
     */
    circle(radius, percentage, position, starting_angle=0){
        let points= []
        for (let i = starting_angle; i<= (Math.PI*2)*percentage;i+= (Math.PI*2)/this.segments ){
            points.push(new THREE.Vector3(radius*Math.cos(i), radius*Math.sin(i), 0))
        }

        let curve = new THREE.CatmullRomCurve3(points)
        let samplePoints = curve.getPoints(this.numberOfSamples)
        let curveGeometry =
    
                new THREE.BufferGeometry().setFromPoints( samplePoints )
    
        
    
        let lineObj = new THREE.Line( curveGeometry, this.lineMaterial )
    
        lineObj.position.set(position.x,position.y,position.z)
        return lineObj



    }
    /**
    * Enables the painting object in the scene
    */
    enable(){
        this.scene.add(this.paint)
    }
    /**
    * Disables the painting object in the scene
    */
    disable(){

        this.scene.remove( this.paint )
    }
}
import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import { MyGame } from './MyGame.js';
import { MyTrack } from './factories/MyTrack.js';

/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.axis = null
        this.isWireframe = false
        this.lightHelpers = false
        this.activeLight = true        
        

        this.track = new MyTrack(10);

        let gui = new MyGuiInterface(this.app)
        gui.setContents(this)
        gui.init();

        let game = new MyGame(this.app)
        game.start()
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }
    }

    update() {
    }

    Wireframe(){
        this.graph.remove(this.app.scene)
        this.graph.wireframe(this.isWireframe)
        this.graph.build()
        this.graph.create(this.app.scene)
    }

    showLightHelpers(){
        this.graph.remove(this.app.scene)
        this.graph.lightHelpers(this.lightHelpers)
        this.graph.build()
        this.graph.create(this.app.scene)
    }

    activateLight(){
    
        this.graph.remove(this.app.scene)
        this.graph.lights(this.activeLight)
        this.graph.build()
        this.graph.create(this.app.scene)
    }
}

export { MyContents };

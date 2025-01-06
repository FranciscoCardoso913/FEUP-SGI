import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import { MyGame } from './MyGame.js';
import { MyTrack } from './factories/MyTrack.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyGraph } from './parser/MyGraph.js';
import { MyObstacle } from './factories/MyObstacle.js';
import { MyPowerUp } from './factories/MyPowerUp.js';
import { MyRoute } from './factories/MyRoute.js';


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

        this.lastUpdateTime = 0;
        this.interval = 1/30;

        
        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
    
        // Reads scene 
        this.reader.open("YASF/track.json").then(async(json) => {
            
            //console.log(json['yasf']);
            this.graph = new MyGraph(json) //Parse json
            await this.graph.init()
            this.graph.build() // Construct graph
            this.graph.create(this.app.scene) // adds the graph to the scene

            //this.app.cameras.concat( this.graph.cameras) //Get cameras
            this.app.cameras = this.graph.cameras

            //Gets all the cameras names for the interface
            this.app.camerasNames = Object.entries(this.app.cameras).reduce((list, [name, value]) => {
                list.push(name)
                return list;
            }, []);
            

            console.log(this.app.cameras)
    
    
            this.app.activeCameraName = this.graph.initCamera //Set active camera
            this.activeLight = true        
        
            let gui = new MyGuiInterface(this.app)
            gui.setContents(this)
            gui.init();

            let game = new MyGame(this.app)

 
            game.start()
        })
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
        this.path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-5, 0, 0),
            new THREE.Vector3(-5, 0, -10), // 1 curve
            new THREE.Vector3(3, 0, -10),  // 2 curve
            new THREE.Vector3(3, 0, -3),   // 3 curve   
            new THREE.Vector3(-2, 0, -3),  // 4 curve
            new THREE.Vector3(-2, 0, 3),   // 5 curve
            new THREE.Vector3(5, 0, 3),    // 6 curve
            new THREE.Vector3(5, 0, 10),   // 7 curve
            new THREE.Vector3(-5, 0, 10),  // 8 curve
            new THREE.Vector3(-5, 0, 0),
        ], true, 'catmullrom', 0.5);
        let track = new MyTrack(this.path, 7)
        this.app.scene.add(track.track)

        //let obstacle = new MyObstacle(new THREE.Vector3(0, 0, 0))
        //this.app.scene.add(obstacle.obstacle)

        this.powerup = new MyPowerUp(new THREE.Vector3(0, 5, 0))
        this.app.scene.add(this.powerup.powerup)

        let starting_position = new THREE.Vector3(-5, 0, 0)
        this.route = new MyRoute(7, starting_position, 2)
        this.app.scene.add(this.route.visualLine)

    }

    update() {
        const currentTime = performance.now() / 1000; // Get the current time in seconds
        if (currentTime - this.lastUpdateTime > this.interval) {
            // Time has passed, update the power-up
            this.powerup.updatePowerUp();
            this.lastUpdateTime = currentTime; // Update the last update time
        }
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

    /**
     * Called when the scene JSON file load is completed
     * @param {Object} data with the entire scene object
     */
    onSceneLoaded(data) {
        console.info("YASF loaded.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    printYASF(data, indent = '') {
        for (let key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                console.log(`${indent}${key}:`);
                this.printYASF(data[key], indent + '\t');
            } else {
                console.log(`${indent}${key}: ${data[key]}`);
            }
        }
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        //this.printYASF(data)
    }
}

export { MyContents };

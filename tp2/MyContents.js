import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyGraph } from './parser/MyGraph.js';
import { MyGuiInterface } from './MyGuiInterface.js';
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

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
    

        this.reader.open("scenes/poke.json").then((json) => {
            console.log(json['yasf']);
            this.graph = new MyGraph(json)
            this.graph.build()
            this.graph.create(this.app.scene)
            this.app.cameras = this.graph.cameras
    
            this.app.activeCameraName = this.graph.initCamera
        
            this.app.setActiveCamera(this.graph.initCamera)
            this.app.camerasNames = Object.entries(this.app.cameras).reduce((list, [name, value]) => {
                list.push(name)
                return list;
            }, []);

            let gui = new MyGuiInterface(this.app)
            gui.setContents(this)
            gui.init();
        }).catch((error) => {
            console.error("Error in loading JSON:", error);
        });

        
        
        
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
        this.printYASF(data)
    }

    update() {
    }
}

export { MyContents };

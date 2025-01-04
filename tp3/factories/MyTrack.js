import * as THREE from 'three';

import { MyFileReader } from '../parser/MyFileReader.js';
import { MyGraph } from '../parser/MyGraph.js';

class MyTrack  {

    
    /**
       constructs the object
       @param {Number} width The width of the track
    */
    constructor(width = 25) {
        this.width = width
        this.isWireframe = false

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
    
        // Reads scene 
        this.reader.open("YASF/track.json").then((json) => {
            this.graph = new MyGraph(json) //Parse json
            this.graph.build() // Construct graph
            this.graph.create(this.app.scene) // adds the graph to the scene

            this.app.cameras = this.graph.cameras //Get cameras
    
            this.app.activeCameraName = this.graph.initCamera //Set active camera
        
            //Gets all the cameras names for the interface
            this.app.camerasNames = Object.entries(this.app.cameras).reduce((list, [name, value]) => {
                list.push(name)
                return list;
            }, []);

            this.app.renderer.shadowMap.enabled = true; // Enable shadow maps
            this.app.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
            
            
        }).catch((error) => {
            console.error("Error in loading JSON:", error);
        });
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



}

export { MyTrack };

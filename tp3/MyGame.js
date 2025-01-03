import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyGraph } from './parser/MyGraph.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import MyBallon from './factories/MyBalloon.js';
/**
 *  This class contains the contents of out application
 */
class MyGame {
    constructor(scene){
        this.fps = 30
        this.scene = scene
        this.ballons = [
            new MyBallon(0xff3333),
            new MyBallon(0x33ff33),
            new MyBallon(0x3333ff),
        ]

        // Object to store the state of pressed keys
        this.pressedKeys = {};
        this.hasBeenPressedKeys = {};

        // Add event listeners for keydown and keyup
        document.addEventListener('keydown', (event) => {
        this.pressedKeys[event.key] = true;
        this.hasBeenPressedKeys[event.key] = true
        console.log(`Key down: ${event.key}`);
        });

        document.addEventListener('keyup', (event) => {
        this.pressedKeys[event.key] = false;
        console.log(`Key up: ${event.key}`);
        });

        this.start()
    }
    start(){
        console.log(this.ballons)
        const STATES = {
            "PICKING":this.picking,
        }
        let state = "PICKING"
        let args = [this.ballons]
  
        this.picking(...args)
    
    }

    async picking(ballons) {

        let selected = 0
        function drawBallons(scene,ballons, selected){
            let r = 3
            let n = ballons.length
            for (let i = 0; i < n; i++){
                let ballon = ballons[i]
                let theta = 2 * (Math.PI/n) * (i - selected) 
                scene.remove(ballon.getObject())
                ballon.setPosition(new THREE.Vector3(r * Math.sin(-theta),1, r * Math.cos(-theta)))
                scene.add(ballon.getObject())
            }
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }

        drawBallons(this.scene,ballons,selected)
        let isSelected = false
        while(!isSelected){
            let right = this.hasBeenPressedKeys["ArrowRight"] || false;
            let left = this.hasBeenPressedKeys["ArrowLeft"] || false;
            isSelected = this.hasBeenPressedKeys["Enter"] || false;
            let n = this.ballons.length
            if(right)
                selected = (selected +1) % n
            else if(left)
                selected = selected -1

            if(selected < 0) 
                selected = n -1

            if (left || right){
                drawBallons(this.scene,ballons,selected)
                this.hasBeenPressedKeys = {}
            }
            
            await sleep(1000/this.fps)
            
        }
        console.log("out")
    }

}

export default MyGame
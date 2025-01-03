import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyGraph } from './parser/MyGraph.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import MyBallon from './factories/MyBalloon.js';
import animate from './animation.js';
/**
 *  This class contains the contents of out application
 */



class MyGame {

    static STATES = {
        QUIT: -1,
        PICKING: 0,
        POSITION:1
    };

    constructor(app){
       
        this.fps = 30
        this.scene = app.scene
        this.ballons = [
            new MyBallon(0xff3333),
            new MyBallon(0xffff33),
            new MyBallon(0x33ffff),
            new MyBallon(0xffffff),
            new MyBallon(0xff33ff),
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

 
    }

    async start(){
        let state = MyGame.STATES.PICKING
        let args = [this.ballons]

        while( state !== MyGame.STATES.QUIT ){
            let result = {}

            switch (state){
                case MyGame.STATES.PICKING:
                    result = await this.picking(...args);   
                    break

                case MyGame.STATES.POSITION:
                    // TODO
                    console.log("end")
                    result = {state:MyGame.STATES.QUIT, args: []}
                    break
            }

            ({ state, args } = result);
        }
            
    
    }

    async picking(ballons, player1= null) {

        let selected = 0

        ballons.forEach((ballon)=>{
            this.scene.add(ballon.getObject())
        })

        function drawBallons(ballons, selected){
          
            let r = 3
            let n = ballons.length
            for (let i = 0; i < n; i++){
                let ballon = ballons[i]
                let theta = 2 * (Math.PI/n) * (i - selected) 
                let keyframes = ballon.move(new THREE.Vector3(r * Math.sin(-theta),1, r * Math.cos(-theta)))
     
                animate(ballon.getObject(), keyframes, Date.now(), 1)
            }
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }

       
  
        drawBallons(ballons,selected)
     
     
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

            if (left || right || isSelected){
                drawBallons(ballons,selected )
                this.hasBeenPressedKeys = {}
            }
            
            await sleep(1000/this.fps)
            
        }

        let selectedBallon = ballons[selected]
        
        ballons.forEach(ballon => {
            this.scene.remove(ballon.getObject())
        });
        ballons.splice(selected, 1);

        if( player1)
            return { state: MyGame.STATES.POSITION, args: [{player1:player1, player2:selectedBallon}] };
        else
            return { state: MyGame.STATES.PICKING, args: [ballons, selectedBallon] };
 
        
    }

}

export default MyGame
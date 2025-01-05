import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyGraph } from './parser/MyGraph.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import MyBallon from './factories/MyBalloon.js';
import animate from './animation.js';
import MyText from './MyText.js';
import MyParticles from './MyParticles.js';
/**
 *  This class contains the contents of out application
 */



class MyGame {

    static STATES = {
        QUIT: -1,
        NAME:0,
        PICKING:1,
        POSITION:2,
        RACE: 3
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
        this.app = app
        app.setActiveCamera("front")
        this.camera = app.activeCamera
        this.textRender = new MyText()
        this.text = null
 
        

      
        


        
        this.pressedKeys = {}; // Keys that are pressed
        this.hasBeenPressedKeys = {}; // keys that have been pressed
        this.keysPressed = []
        // Add event listeners for keydown and keyup
        document.addEventListener('keydown', (event) => {
        this.pressedKeys[event.key] = true;
        this.hasBeenPressedKeys[event.key] = true
        this.keysPressed.push(event.key)
        console.log(`Key down: ${event.key}`);
        });

        document.addEventListener('keyup', (event) => {
        this.pressedKeys[event.key] = false;
        console.log(`Key up: ${event.key}`);
        });

 
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    async start(){
        let state = MyGame.STATES.NAME
        let args = []

        while( state !== MyGame.STATES.QUIT ){
            let result = {}

            switch (state){
                case MyGame.STATES.NAME:
                result = await this.name(...args);   
                break
                case MyGame.STATES.PICKING:
                    
                    result = await this.picking(...args);   
                    break

                case MyGame.STATES.POSITION:
                    result =  await this.spot(...args)
                    break
            }

            ({ state, args } = result);
        }
        let particles = new MyParticles(this.scene, 100,new THREE.Vector3(-30,0,0),1,1)
        particles.simulate()
            
    
    }

    async picking(ballons, player1= null) {
        
        if(player1)this.text = this.textRender.renderText("Pick Your Oponent ballon", new THREE.Vector3(-12,12,0))
        else this.text = this.textRender.renderText("Pick Your ballon", new THREE.Vector3(-12,12,0))
        this.scene.add(this.text)
        let selected = 0

        if(player1){
            let keyframes = player1.move(new THREE.Vector3(7,5,3))
            animate(player1.getObject(), keyframes, Date.now(), 1)
        }

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
            
            await this.sleep(1000/this.fps)
            
        }

        let selectedBallon = ballons[selected]
        

        ballons.splice(selected, 1);
        this.scene.remove(this.text)
        if(player1){
            let keyframes = selectedBallon.move(new THREE.Vector3(-7,5,3))
            animate(selectedBallon.getObject(), keyframes, Date.now(), 1)

            ballons.forEach(ballon => {
                this.scene.remove(ballon.getObject())
            });
            return { state: MyGame.STATES.POSITION, args: [{player1:player1, player2:selectedBallon}] };
        }else
            return { state: MyGame.STATES.PICKING, args: [ballons, selectedBallon] };
 
    }

    async spot(players){
        await this.sleep(1500)
        const spotA = new THREE.Vector3(-40,5,0)
        const spotB = new THREE.Vector3(-25,5,0)
        const cameraPos = new THREE.Vector3(spotB.x + (spotA.x -spotB.x)/2,60,0)
        let cameraKeyframes = [
            { time: 0, position: this.camera.position.clone()},
            { time: 2, position: cameraPos }
            ];

        let playerKeyframes =players.player1.move(spotA)

            
        animate(players.player1.getObject(), playerKeyframes, Date.now(),2)
        animate(this.camera, cameraKeyframes, Date.now(),2)
        const targetPosition = new THREE.Vector3(spotB.x + (spotA.x -spotB.x)/2, 0, spotA.z); 
        this.camera.target = targetPosition

        this.app.updateCameraIfRequired(true)
        await this.sleep(2000)

        this.text = this.textRender.renderText("Pick Your Spot", new THREE.Vector3(-45,40,-10), new THREE.Euler(-Math.PI/2,0,0))
      
        this.scene.add(this.text)


        let selected = 0
        let isSelected = false

        while(!isSelected){
            let right = this.hasBeenPressedKeys["ArrowRight"] || false;
            let left = this.hasBeenPressedKeys["ArrowLeft"] || false;
            isSelected = this.hasBeenPressedKeys["Enter"] || false;
            if(right){
                if(selected ===0){
                    let keyframes = players.player1.move(spotB)
                    animate(players.player1.getObject(), keyframes, Date.now(), 1)
                }
                selected = 1
            }
            else if(left){
                if(selected ===1){
                    let keyframes = players.player1.move(spotA)
                    animate(players.player1.getObject(), keyframes, Date.now(), 1)
                }
                selected = 0
            }

            if( isSelected || right || left) this.hasBeenPressedKeys = {}

            await this.sleep(1000/this.fps)

        }

        if(selected === 0) {
            let keyframes = players.player2.move(spotB)
            animate(players.player2.getObject(), keyframes, Date.now(), 1)
        }else{
            let keyframes = players.player2.move(spotA)
            animate(players.player2.getObject(), keyframes, Date.now(), 1)
        }

        this.scene.remove(this.text)
        await this.sleep(1000)

        return {state: MyGame.STATES.QUIT, args:[{players: players}]}

    }

    async name(){

        function isCharacterKey(key) {
            return key.length === 1 && key !== " " && !key.startsWith("Arrow") && key !== "Enter" && key !== "Backspace";
        }
        
        this.text = this.textRender.renderText("Insert Name:", new THREE.Vector3(-20,50,40))
        this.scene.add(this.text)
        let isSelected = false
        let index = 12
        let chars = []
        while(!isSelected){
            this.keysPressed.forEach((key)=>{
                if(key ==="Enter"){
                    isSelected = true
                }else if (key === "Backspace"){
                    
                    
                    if(chars.length > 0){
                        let char = chars.pop()
                        this.text.remove(char)
                    }

                }else if (isCharacterKey(key)){
                    let char = this.textRender.addChar(this.text,key, index + chars.length)
                    chars.push(char)
                }
            })

            this.keysPressed = []

            await this.sleep(1000/this.fps)
        }
        this.scene.remove(this.text)
        const cameraPos = new THREE.Vector3(0,5,17)
        let cameraKeyframes = [
            { time: 0, position: this.camera.position.clone()},
            { time: 2, position: cameraPos }
            ];


        animate(this.camera, cameraKeyframes, Date.now(),2)
        const targetPosition = new THREE.Vector3(0, 5, 0); 
        this.camera.target = targetPosition

        this.app.updateCameraIfRequired(true)

        this.keysPressed = []
        this.pressedKeys = {}
        this.hasBeenPressedKeys= {}

        return {state:MyGame.STATES.PICKING, args: [this.ballons]}
    }

}

export { MyGame }
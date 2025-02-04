import * as THREE from 'three';
import MyBallon from './factories/MyBalloon.js';
import animate from './animation.js';
import MyText from './factories/MyText.js';
import MyParticles from './factories/MyParticles.js';
import MyRace from './MyRace.js';
import MyTrack from './factories/MyTrack.js';
import MyRoute from './factories/MyRoute.js';
/**
 *  This class contains the contents of out application
 */
class MyGame {

    static STATES = {
        QUIT: -1,
        NAME:0,
        PICKING:1,
        POSITION:2,
        RUN: 3,
        RES:4
    };

    constructor(app, track){
       
        this.fps = 30
        this.scene = app.scene
        this.ballons = [
            new MyBallon(0xff3333),
            new MyBallon(0xffff33),
            new MyBallon(0x33ffff),
            new MyBallon(0xffffff),
            new MyBallon(0xff33ff),
        ]
        this.track = track
        this.app = app
        app.setActiveCamera("front")
        this.camera = app.activeCamera
        this.firstPersonCamera = app.cameras["firstPerson"]
        this.thirdPersonCamera = app.cameras["thirdPerson"]
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
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedMesh = null

        window.addEventListener('click', (event)=> {
            // Calculate mouse position in normalized device coordinates (-1 to +1)
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          
            // Update the raycaster with the camera and mouse position
            this.raycaster.setFromCamera(this.mouse, this.camera);
            let i = 0
            this.ballons.forEach((ballon)=>{
                // Check for intersections with objects in the scene
                const intersects = this.raycaster.intersectObject(ballon.getObject());
            
                if (intersects.length > 0) {
                    this.selectedMesh = i
                }
                i++;
            })

          });

        this.width = 15
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
        this.track = new MyTrack(this.path, this.width)
        this.app.scene.add(this.track.track)
        this.app.scene.add(this.track.powerups_obj)
        this.app.scene.add(this.track.obstacles_obj)
    
        this.tv_rotation = new THREE.Vector3(0,50*Math.PI/180,0)
        this.tv_position = new THREE.Vector3(-150,40,-45)
        this.starting_position = this.track.path.getPointAt(0).clone()
 
        this.route = new MyRoute(this.track.width, this.track.path.points[0].clone(), 3);
        this.time = this.textRender.renderText("Time: 0", new THREE.Vector3(-150,40,-45), this.tv_rotation)
        this.scene.add(this.time)
        
        this.ticketsNumber = this.textRender.renderText("Tickets: 0", new THREE.Vector3(-150,30,-45), this.tv_rotation)
        this.scene.add(this.ticketsNumber)

        this.wind = this.textRender.renderText("Wind: None", new THREE.Vector3(-150,20,-45), this.tv_rotation)
        this.scene.add(this.wind)
    }

    /**Updates camera when player ballon moves */
    updateCamera(player){
        const pos = player.getObject().position.clone()
        this.thirdPersonCamera.position.copy(new THREE.Vector3().addVectors(pos.clone(), new THREE.Vector3(0,6, 12)))
        this.firstPersonCamera.position.copy(new THREE.Vector3().addVectors(pos.clone(), new THREE.Vector3(0,-1, 0)))

      
        
        this.firstPersonCamera.target = new THREE.Vector3().addVectors(pos.clone(), new THREE.Vector3(player.getObject().vx,-1, player.getObject().vz))
        this.thirdPersonCamera.target = new THREE.Vector3().addVectors(pos.clone(), new THREE.Vector3(player.getObject().vx,-1, player.getObject().vz))
        this.app.updateCameraIfRequired(true)
        
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      /**
       * Game loop
       */
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

                case MyGame.STATES.RUN:
                    result = await this.run(...args)
                    break

                case MyGame.STATES.RES:
                    console.log(args)
                    result = await this.res(...args)
                    break
                        
            }

            ({ state, args } = result);
        }
   
            
    
    }
    /**
     * Picking up the ballons for the race
     */
    async picking(ballons, player1= null) {
        
        if(player1)this.text = this.textRender.renderText("Pick Your Opponent ballon", new THREE.Vector3(-12,12,110))
        else this.text = this.textRender.renderText("Pick Your ballon", new THREE.Vector3(-12,12,110))
        this.scene.add(this.text)
        let selected = 0

        if(player1){
            let keyframes = player1.move(new THREE.Vector3(7,5,120))
            animate(player1.getObject(), keyframes, Date.now(), 1)
        }

        ballons.forEach((ballon)=>{
            this.scene.add(ballon.getObject())
        })

        function drawBallons(ballons, selected){
            let r = 10
            let n = ballons.length
            for (let i = 0; i < n; i++){
                let ballon = ballons[i]

                let keyframes = ballon.move(new THREE.Vector3(-2*r + r*i,2, 100))
     
                animate(ballon.getObject(), keyframes, Date.now(), 1)
            }
        }

       
        drawBallons(ballons,selected)
     
     
        let isSelected = false

        while(!isSelected){
            isSelected = this.selectedMesh !==null ?true : false;

            if (isSelected){
                selected = this.selectedMesh
                drawBallons(ballons,selected )
                this.selectedMesh = null
            }
            
            await this.sleep(1000/this.fps)
            
        }

        let selectedBallon = ballons[selected]
        

        ballons.splice(selected, 1);
        this.scene.remove(this.text)
        if(player1){
            let keyframes = selectedBallon.move(new THREE.Vector3(-7,5,120))
            animate(selectedBallon.getObject(), keyframes, Date.now(), 1)

            ballons.forEach(ballon => {
                this.scene.remove(ballon.getObject())
            });
            return { state: MyGame.STATES.POSITION, args: [{player1:player1, player2:selectedBallon}] };
        }else
            return { state: MyGame.STATES.PICKING, args: [ballons, selectedBallon] };
 
    }

    /**
     * Picking up the starting spot
     */
    async spot(players){

        this.hasBeenPressedKeys= {}

        await this.sleep(1500)
        let position_dif = new THREE.Vector3(3,0,0)
      
        this.starting_position.y = 10
        const spotA = new THREE.Vector3().subVectors( this.starting_position.clone() , position_dif )
        const spotB = new THREE.Vector3().addVectors( this.starting_position.clone() , position_dif )
     
        const cameraPos = new THREE.Vector3(spotB.x + (spotA.x -spotB.x)/2,60)
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

        this.text = this.textRender.renderText("Pick Your Spot", new THREE.Vector3(cameraPos.x -20,40,cameraPos.z -10), new THREE.Euler(-Math.PI/2,0,0))
      
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

        return {state: MyGame.STATES.RUN, args:[players]}

    }
    /**
     * Writing user name and displaying it
     */
    async name(){

        function isCharacterKey(key) {
            return key.length === 1 && key !== " " && !key.startsWith("Arrow") && key !== "Enter" && key !== "Backspace";
        }
        const title =this.textRender.renderText("Vrum Vrum", new THREE.Vector3(-20,50,180))
        const credits =this.textRender.renderText("Credits: Francisco Cardoso,Jose Martins and FEUP", new THREE.Vector3(-33,25,170))
        this.text = this.textRender.renderText("Insert Name:", new THREE.Vector3(-30,50,170))
        this.scene.add(title)
        this.scene.add(credits)
        this.scene.add(this.text)
        let isSelected = false
        let index = 12
        let chars = []
        let letters = []
        while(!isSelected){
            this.keysPressed.forEach((key)=>{
                if(key ==="Enter"){
                    if (letters.length > 0) {
                        isSelected = true
                        this.name = letters.join("")
                    }
                }else if (key === "Backspace"){
                    if(chars.length > 0){
                        let char = chars.pop()
                        letters.pop()
                        this.text.remove(char)
                    }

                }else if (isCharacterKey(key)){
                    let char = this.textRender.addChar(this.text,key, index + chars.length)
                    letters.push(key)
                    chars.push(char)
                }
            })

            this.keysPressed = []

            await this.sleep(1000/this.fps)
        }

        console.log(chars, this.name)
        this.scene.remove(this.text)
        this.scene.remove(title)
        this.scene.remove(credits)
        const cameraPos = new THREE.Vector3(0,5,130)
        let cameraKeyframes = [
            { time: 0, position: this.camera.position.clone()},
            { time: 1, position: cameraPos }
            ];


        animate(this.camera, cameraKeyframes, Date.now(),1)
        const targetPosition = new THREE.Vector3(0, 5, 0); 
        this.camera.target = targetPosition

        this.app.updateCameraIfRequired(true)

        this.keysPressed = []
        this.pressedKeys = {}
        this.hasBeenPressedKeys= {}

        return {state:MyGame.STATES.PICKING, args: [this.ballons]}
    }

    /**
     * The race logic
     */
    async run(players){

        let index= 0;
        let path = this.route.route
        this.app.setActiveCamera("thirdPerson")
       
        this.updateCamera(players.player1);

        setInterval(() => {
            this.updateCamera(players.player1);
        }, 10); 


      
        this.starting_time = Date.now()
        let keyframes = []

        this.race = new MyRace(this.scene, this.starting_time, players.player1, players.player2, this.track)
        while (!this.race.ended) {

            let layernumber = this.race.layer.layer
            if (this.hasBeenPressedKeys["w"]) {
                
                if (layernumber < 4) keyframes = this.race.changeLayer(++layernumber)
            }
            else if (this.hasBeenPressedKeys["s"]) {
                if (layernumber > 0) keyframes = this.race.changeLayer(--layernumber)
            }
            if(this.hasBeenPressedKeys["p"]){
                this.hasBeenPressedKeys = {}
                while(!this.hasBeenPressedKeys["p"]){
                    await this.sleep(1000 / this.fps)
                }
            }
            if(this.hasBeenPressedKeys["r"]){
              
                index =0 
                race.changeLayer(0)
                players.player1.move(this.starting_position)
                players.player1.getObject().rotation.copy(new THREE.Euler(0,0,0))
                players.player2.move(this.starting_position)
                this.ticketsNumber = 0
                this.starting_time = Date.now()
        
            }
            this.hasBeenPressedKeys = {}

            // Move the player
            if (keyframes.length > 0) {
                animate(players.player1.getObject(), keyframes, Date.now(), 1)
                keyframes = []
            }

            this.race.checkMovement(this.fps)
        
            this.track.powerups.forEach((powerup)=>{
                powerup.updatePowerUp()
            })

            if(!players.player2.cooldown){
                if(index>= path.length)
                    return {state: MyGame.STATES.RES, args: [players, "lose"]}
                let p = path[index].clone()
                p.y = 10
                let keyframes = players.player2.move(p, 2000)
                animate(players.player2.getObject(),keyframes,Date.now(), 1)
                index++;


            }

            // Move the autonomous player

            this.updateText()

            if (this.track.won()) {
                return {state: MyGame.STATES.RES, args: [players, "won"]}
            }

            await this.sleep(1000 / this.fps)
        }
        
        return {state: MyGame.STATES.RES, args: []}
        
    }

    /**
     * Showing up the race results
     */
    async res(players, result){
        await this.sleep(1000)

        this.scene.remove(this.time)
        this.scene.remove(this.ticketsNumber)
        this.scene.remove(this.wind)

        console.log(this.name)
        this.result = this.textRender.renderText("You " + result + ", " + this.name, new THREE.Vector3(-150,40,-45), this.tv_rotation)
        this.scene.add(this.result)

        let time = Math.floor((Date.now() - this.starting_time) / 1000)
        this.time = this.textRender.renderText("Finished at: " + time, new THREE.Vector3(-150,30,-45), this.tv_rotation)
        this.scene.add(this.time)

        players.player1.cooldown = false
        players.player1.getObject().position.copy(new THREE.Vector3(-150, 40, -10))
        players.player1.getObject().rotation.copy(new THREE.Euler(0,0,0))
        players.player2.move(new THREE.Vector3(-150, 30, -10))
        this.app.setActiveCamera("final")
        let particles = new MyParticles(this.scene, 100,new THREE.Vector3(-150, 0, -20),40,40)
        particles.simulate()
        await this.sleep(3000)
        while(true){
            if(this.hasBeenPressedKeys["Enter"]) return {state: MyGame.STATES.QUIT, args: []}
            await this.sleep(1000 / this.fps)
        }
        
    }
    /**Updates text in the big screen */
    updateText(){

        this.scene.remove(this.time)
        let time = Math.floor((Date.now() - this.starting_time) / 1000)
        this.time = this.textRender.renderText("Time: " + time, new THREE.Vector3(-150,40,-45), this.tv_rotation)
        this.scene.add(this.time)

        this.scene.remove(this.ticketsNumber)
        this.ticketsNumber = this.textRender.renderText("Tickets: " + this.race.tickets, new THREE.Vector3(-150,30,-45), this.tv_rotation)
        this.scene.add(this.ticketsNumber)

        this.scene.remove(this.wind)
        this.wind = this.textRender.renderText("Wind: " + this.race.wind, new THREE.Vector3(-150,20,-45), this.tv_rotation)
        this.scene.add(this.wind)

    }

}

export { MyGame }
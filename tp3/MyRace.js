import * as THREE from 'three';


class Layer {
    constructor(layer, speed, y_pos) {
        this.layer = layer;
        this.speed = speed;
        this.y_pos = y_pos;
    }
}

class MyRace {
    constructor(scene, startingTime, playerBalloon, autonomousBalloon, track) {
        this.scene = scene;
        this.startingTime = startingTime;
     
        this.playerBalloon = playerBalloon;
        this.autonomousBalloon = autonomousBalloon;
        this.track = track;
        this.layer = new Layer(0, new THREE.Vector3(0, 0, 0), 3);

        this.tickets = 0;
        this.wind = "None"
        this.hit_time = Date.now();

        
    }

    changeLayer(layer) {
   
        this.layer.layer = layer;

        switch (layer) {
            case 0: 
                this.layer.speed = new THREE.Vector3(0, 0, 0); // No Wind
                this.wind = "None"
                break;
            case 1:
                this.layer.speed = new THREE.Vector3(0, 0, -10); // North
                this.wind = "North"
                break;
            case 2:
                this.layer.speed = new THREE.Vector3(0, 0, 10); // South
                this.wind = "South"
                break;
            case 3:
                this.layer.speed = new THREE.Vector3(-10, 0, 0); // East
                this.wind = "East"
                break;
            case 4:
                this.layer.speed = new THREE.Vector3(10, 0, 0); // West
                this.wind = "West"
                break;
            default:
                console.log("INVALID LAYER");
                break;

        }
        
        this.layer.y_pos = (layer*3) +10;
        this.track.changeLayer(this.layer.y_pos)

        return this.playerBalloon.setDirection(this.layer.speed, this.layer.y_pos);

    }

    checkMovement(fps) {

        function collision(el1, el2){
            const distance = el1.getObject().position.clone().distanceTo(el2.getObject().position.clone());
           
            if(distance <= (el1.hitSphere + el2.hitSphere )) console.log("haaaaa")
            return distance <= (el1.hitSphere + el2.hitSphere )
        }

        if ((Date.now() - this.hit_time) < 1000) {
            return
        }
   

        let collided = false;
    
        if (!this.track.inside(this.playerBalloon.getObject().position)) {
            console.log("ola")
            collided = true;
        }
        else {
            for (let i = 0; i < this.track.obstacles.length; i++) {
                
                if (collision(this.playerBalloon, this.track.obstacles[i])) {
                    console.log("fbfdhbf")
                    collided = true;
                    break;
                }
            }
        }
      
        if (collided) {
       
            let p = this.track.points[this.track.prevPoint].clone()
            p.y= this.playerBalloon.getObject().position.y
          
            this.playerBalloon.move(p);

            if (this.tickets > 0) this.tickets--; 
            else this.hit_time = Date.now();
            return;
        }

        for (let i = 0; i < this.track.powerups.length; i++) {
            if (collision(this.playerBalloon, this.track.powerups[i])) {
                this.tickets++;
                console.log("Tickets: " + this.tickets);
                break;
            }
        }

        this.playerBalloon.moveWithSpeed(fps)
    }





}

export default MyRace;
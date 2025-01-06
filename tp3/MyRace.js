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
        console.log(playerBalloon);
        this.playerBalloon = playerBalloon;
        this.autonomousBalloon = autonomousBalloon;
        this.track = track;
        this.layer = new Layer(0, new THREE.Vector3(0, 0, 0), 3);

        this.tickets = 0;
        this.hit_time = Date.now();

        //this.route = new MyRoute(this.track.width, this.track.path.points.getPointAt(0).clone(), 3);
    }

    changeLayer(layer) {
        console.log("Changing Layer to: " + layer);
        this.layer.layer = layer;

        switch (layer) {
            case 0: 
                this.layer.speed = new THREE.Vector3(0, 0, 0); // No Wind
                break;
            case 1:
                this.layer.speed = new THREE.Vector3(0, 0, -5); // North

                break;
            case 2:
                this.layer.speed = new THREE.Vector3(0, 0, 5); // South
                break;
            case 3:
                this.layer.speed = new THREE.Vector3(-5, 0, 0); // East
                break;
            case 4:
                this.layer.speed = new THREE.Vector3(5, 0, 0); // West
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
            return distance <= (el1.hitSphere + el2.hitSphere )
        }


        if ((Date.now() - this.hit_time) < 1000) {
            return
        }

        let collided = false;

        if (!this.track.inside(this.playerBalloon.getObject().position)) {
            collided = true;
        }
        else if (collision(this.playerBalloon, this.autonomousBalloon)){
            collided = true;
        }
        else {
            for (let i = 0; i < this.track.obstacles.length; i++) {
                if (collision(this.playerBalloon, this.track.obstacles[i])) {
                    collided = true;
                    break;
                }
            }
        }
        
        if (collided) {
            this.playerBalloon.move(this.track.points(this.track.prevPoint));

            if (tickets <= 0) tickets--; 
            else this.hit_time = Date.now();
            return;
        }

        for (let i = 0; i < this.track.powerUps.length; i++) {
            if (collision(this.playerBalloon, this.track.powerUps[i])) {
                this.tickets++;
                console.log("Tickets: " + this.tickets);
                this.track.powerUps[i].getObject().position.set(0, -100, 0);
                this.hit_time = Date.now();
                break;
            }
        }

        this.playerBalloon.moveWithSpeed(fps)
    }





}

export default MyRace;
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
        this.track.changeLayer(layer)

        return this.playerBalloon.setDirection(this.layer.speed, this.layer.y_pos);
        
        

    }





}

export default MyRace;
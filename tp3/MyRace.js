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
    }

    changeLayer(layer) {
        console.log("Changing Layer to: " + layer);
        this.layer.layer = layer;

        switch (layer) {
            case 0: 
                this.layer.speed = new THREE.Vector3(0, 0, 0); // No Wind
                break;
            case 1:
                this.layer.speed = new THREE.Vector3(0, 0, -0.2); // North
                break;
            case 2:
                this.layer.speed = new THREE.Vector3(0, 0, 0.2); // South
                break;
            case 3:
                this.layer.speed = new THREE.Vector3(-0.2, 0, 0); // East
                break;
            case 4:
                this.layer.speed = new THREE.Vector3(0.2, 0, 0); // West
                break;
            default:
                console.log("INVALID LAYER");
                break;

        }
        
        this.layer.y_pos = (layer*3) +10 ;


    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update balloons and track here

        this.renderer.render(this.scene, this.camera);
    }
}

export default MyRace;
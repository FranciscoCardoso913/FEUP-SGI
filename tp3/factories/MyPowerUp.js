import * as THREE from 'three';

class MyPowerUp  {

    constructor(position) {
        this.position = position
        this.powerup = this.build()
        this.rotationChange = 0.01
        this.animate = this.animate.bind(this)
        this.clock = new THREE.Clock();
        this.hitSphere = 1
    }

    build(){

        const vertex = `
            // Vertex Shader
            uniform vec3 uScale; // Scale factors for width, height, and depth

            void main() {
                vec3 scaledPosition = position * uScale; // Scale the vertex positions
                gl_Position = projectionMatrix * modelViewMatrix * vec4(scaledPosition, 1.0);
            }

        `
        const fragment =`
            // Fragment Shader
            uniform vec3 uColor;   // Color passed from material
            uniform float uOpacity; // Opacity passed from material

            void main() {
                gl_FragColor = vec4(uColor, uOpacity); // Apply color and opacity
            }
        `
        this.extmaterial = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                uScale: { value: new THREE.Vector3(1, 1, 1) }, // Initial scale
                uColor: { value: new THREE.Color(0xffffff) }, // Color (same as MeshBasicMaterial)
                uOpacity: { value: 0.5 }, // Opacity (same as MeshBasicMaterial)
            },
            transparent: true, // Enable transparency for ShaderMaterial
            wireframe: false,  // Wireframe option
        });
        let intmaterial = new THREE.MeshBasicMaterial({ color: 0x00aaaa, wireframe: false });
        let geometry1 = new THREE.BoxGeometry(1, 1, 1);
        let geometry2 = new THREE.BoxGeometry(1, 1, 1);
        let insideGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        this.box1 = new THREE.Mesh(geometry1, this.extmaterial);
        this.box2 = new THREE.Mesh(geometry2, this.extmaterial);
        this.insideBox = new THREE.Mesh(insideGeometry, intmaterial);

        this.box1.rotateX(47*Math.PI/180);
        this.box1.rotateY(47*Math.PI/180);
        this.box1.rotateZ(47*Math.PI/180);

        this.box2.rotateX(-44*Math.PI/180);
        this.box2.rotateY(-44*Math.PI/180);
        this.box2.rotateZ(-44*Math.PI/180);

        let group = new THREE.Group();
        group.add(this.box1);
        group.add(this.box2);
        group.add(this.insideBox);

        group.position.set(this.position.x, this.position.y, this.position.z);

        return group;
    }

    animate(){
        
        requestAnimationFrame(this.animate);
        
        // Update scale dynamically (for example, decrease over time)
        const time = this.clock.getElapsedTime();
        const scaleFactor = Math.abs(Math.sin(time*1.5))+0.5; // Decrease but keep minimum size
        this.extmaterial.uniforms.uScale.value.set(scaleFactor, scaleFactor, scaleFactor);
    }

    updatePowerUp(){

        this.box1.rotation.x -= this.rotationChange
        this.box1.rotation.y -= this.rotationChange
        this.box1.rotation.z -= this.rotationChange

        this.box2.rotation.x += this.rotationChange
        this.box2.rotation.y += this.rotationChange
        this.box2.rotation.z += this.rotationChange

        this.insideBox.rotation.y += this.rotationChange

        this.animate()

    }
    getObject(){
        return this.group
    }

}

export default MyPowerUp;

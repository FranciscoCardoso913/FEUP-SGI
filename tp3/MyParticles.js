import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */



class MyParticles {
    constructor(scene,nParticulars = 100, position = new THREE.Vector3(0,0,0), width = 10, height = 10 ){
        this.scene = scene
        this.position = position
        this.animate = this.animate.bind(this);
        this.particleCount = nParticulars; // Number of this.particles
        this.particles = new THREE.BufferGeometry();
         this.positions = new Float32Array(this.particleCount * 3); // x, y, z for each particle
         this.velocities = []; // Store velocity for each particle
         this.lifetimes = []; // Store this.lifetimes for this.particles

        // Initialize this.particles
        for (let i = 0; i < this.particleCount; i++) {
            const x = (Math.random() - 0.5) * width; // Random x position on the ground
            const y = 0; // Starting from ground
            const z = (Math.random() - 0.5) * height; // Random z position
            this.positions.set([x, y, z], i * 3);

            this.velocities.push(
                (Math.random() - 0.5) * 10, // Random x velocity
                Math.random() * 10 + 20,     // Upward y velocity
                (Math.random() - 0.5) * 10  // Random z velocity
            );
            this.lifetimes.push(Math.random() * 2 + 2); // Random lifetime (1-3 seconds)
        }

        this.particles.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 1,
        });
        this.particlesystem = new THREE.Points(this.particles, material);
        this.particlesystem.position.add(position)
       

    }



    simulate(){
        this.scene.add(this.particlesystem)
        this.gravity = -9.8 ; 
        this.explosionParticles = []; // Track this.particles for explosions
        this.animate()
        setTimeout(()=>this.scene.remove(this.particlesystem), 4000)
       
    }

    animate() {
        const delta = 0.016; // Assume 30 FPS
        this.positions = this.particles.attributes.position.array;
        for (let i = 0; i < this.particleCount; i++) {
            const vx = this.velocities[i * 3];
            const vy = this.velocities[i * 3 + 1];
            const vz = this.velocities[i * 3 + 2];
            const lifetime = this.lifetimes[i];
    
            if (lifetime > 0) {
                // Update position
                this.positions[i * 3] += vx * delta;
                this.positions[i * 3 + 1] += vy * delta;
                this.positions[i * 3 + 2] += vz * delta;
    
                // Apply gravity
                this.velocities[i * 3 + 1] += this.gravity * delta;
    
                // Reduce lifetime
                this.lifetimes[i] -= delta;
                this.particlesystem.material.opacity -= delta*0.003
            } else if (!this.explosionParticles.includes(i)) {
                // Explode particle
 
                this.createExplosion(this.positions[i * 3], this.positions[i * 3 + 1], this.positions[i * 3 + 2]);
                this.positions[i * 3] =0;
                this.positions[i * 3 + 1] = 0;
                this.positions[i * 3 + 2] = 0;
                this.explosionParticles.push(i);
            }
        }
    
        this.particles.attributes.position.needsUpdate = true;
    
        requestAnimationFrame(this.animate);
    }



    createExplosion(x, y, z) {
        const burstCount = 50;
        const burstPositions = [];
        const burstVelocities = [];
    
        // Generate initial positions and velocities for the explosion
        for (let i = 0; i < burstCount; i++) {
            const angle = Math.random() * Math.PI * 2; // Random direction
            const speed = Math.random() * 3 + 3; // Random speed
    
            burstPositions.push(x, y, z); // Origin of explosion
            burstVelocities.push(
                Math.cos(angle) * speed, // X velocity
                Math.sin(angle) * speed, // Y velocity
                (Math.random() - 0.5) * speed // Z velocity
            );
        }

        const  getRandomColorHex = ()=> {
            return `#${Math.floor(Math.random() * 16700000+ 77215).toString(16).padStart(6, '0')}`;
        }
    
        // Create the explosion geometry and material
        const explosionGeometry = new THREE.BufferGeometry();
        explosionGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(burstPositions), 3));
        const explosionMaterial = new THREE.PointsMaterial({ 
            color: getRandomColorHex(), 
            size: 0.3, 
            transparent: true, 
            opacity: 1.0 
        });
        const explosion = new THREE.Points(explosionGeometry, explosionMaterial);
        explosion.position.add(this.position)
        this.scene.add(explosion);
    
        // Animate the explosion particles
        const velocities = burstVelocities;
        const positions = explosionGeometry.attributes.position.array;
        const lifetime = 1.5; // Lifetime in seconds
        let elapsedTime = 0;
    
        const animateExplosion = () => {
            const delta = 0.016; // Assume 60 FPS
            elapsedTime += delta;
    
            for (let i = 0; i < burstCount; i++) {
                // Update positions based on velocities
                positions[i * 3] += velocities[i * 3] * delta;
                positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
                positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
    
        
        
            }
    
            // Update the geometry
            explosionGeometry.attributes.position.needsUpdate = true;
    
            // Gradually fade out particles
            explosionMaterial.opacity = Math.max(0, 1 - elapsedTime / lifetime);
    
            if (elapsedTime < lifetime) {
                requestAnimationFrame(animateExplosion);
            } else {
                // Remove the explosion after its lifetime
                this.scene.remove(explosion);
                explosionGeometry.dispose();
                explosionMaterial.dispose();
            }
        };
    
        animateExplosion();
    }
    



}

export default MyParticles
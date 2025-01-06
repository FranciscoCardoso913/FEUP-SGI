import * as THREE from 'three';

class MyObstacle  {
    
        constructor(position) {
            this.position = position
            this.hitSphere = 100
            this.build()
        }
    
        build(){

            this.obstacle = new THREE.LOD();
            
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('/image/textures/box.jpg');
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            
            // Define Lod Levels
            const material = new THREE.MeshBasicMaterial({ color: 0x895129, wireframe: false, map: texture });

            // High-detail model
            const highDetailGeometry = new THREE.BoxGeometry(5, 5, 5, 30, 30, 30);
            const highDetailMesh = new THREE.Mesh(highDetailGeometry, material);
            highDetailMesh.position.copy(this.position)
            this.obstacle.addLevel(highDetailMesh, 10);

            // Medium-detail model
            const mediumDetailGeometry = new THREE.BoxGeometry(5, 5, 5, 20, 20, 20);
            const mediumDetailMesh = new THREE.Mesh(mediumDetailGeometry, material);
            mediumDetailMesh.position.copy(this.position)
            this.obstacle.addLevel(mediumDetailMesh, 20);

            // Low-detail model
            const lowDetailGeometry = new THREE.BoxGeometry(5, 5, 5, 5, 5, 5);
            const lowDetailMesh = new THREE.Mesh(lowDetailGeometry, material);
            lowDetailMesh.position.copy(this.position)
            this.obstacle.addLevel(lowDetailMesh, 30);

        }

        getObject(){
            return this.obstacle;
        }
    
}

export default MyObstacle ;

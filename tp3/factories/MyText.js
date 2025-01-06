import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */



class MyText {
    constructor(){
        const textureLoader = new THREE.TextureLoader();
        this.spritesheet = textureLoader.load('/image/spritesheets.png'); // Your spritesheet file

        // Configure the texture to avoid blurring between characters
        this.spritesheet.minFilter = THREE.NearestFilter;
        this.spritesheet.magFilter = THREE.NearestFilter;
        this.spritesheet.wrapS = THREE.ClampToEdgeWrapping;
        this.spritesheet.wrapT = THREE.ClampToEdgeWrapping;

        // Assume a 16x16 grid for 256 characters
        this.gridSize = 16; // Characters per row and column
        this.tileSize = 1 / this.gridSize; // Size of one tile in UV space

        this.material = new THREE.MeshBasicMaterial({
            map: this.spritesheet,
            transparent: true,
          
        });

    }

    getUVCoordinates(asciiCode, gridSize) {
        const column = asciiCode % gridSize; // Column in the grid
        const row = Math.floor(asciiCode / gridSize); // Row in the grid
    
        const u = column * this.tileSize; // U coordinate
        const v = 1 - (row + 1) * this.tileSize; // V coordinate (flipped vertically)
    
        return { u, v };
    }

    createCharacter(asciiCode, position, material) {
        const geometry = new THREE.PlaneGeometry(1, 1); // Adjust size as needed
    
        // Get UV coordinates for the character
        const { u, v } = this.getUVCoordinates(asciiCode, this.gridSize);
        const uvAttribute = geometry.attributes.uv;
    
        // Set UV mapping for the character's plane
        uvAttribute.setXY(0, u, v + this.tileSize);          // Bottom-left
        uvAttribute.setXY(1, u + this.tileSize, v + this.tileSize); // Bottom-right
        uvAttribute.setXY(2, u, v);                    // Top-left
        uvAttribute.setXY(3, u + this.tileSize, v);         // Top-right
        uvAttribute.needsUpdate = true;
    
        // Create the mesh and position it
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);
    
        return mesh;
    }

    renderText(text, startPosition, rotate = new THREE.Vector3(0,0,0)) {

        const characters = Array.from(text); // Split the string into characters
        const textMesh = new THREE.Group()
        characters.forEach((char, index) => {
            const asciiCode = char.charCodeAt(0);
            const position = {
                x: index, // Space between characters
                y: 0,
                z: 0,
            };
    
            let characterMesh = this.createCharacter(asciiCode, position, this.material);
    
            textMesh.add(characterMesh);
        });
        textMesh.position.add(startPosition)
        textMesh.rotation.copy(rotate)
        return textMesh
    }

    addChar(text, char, index){
            const asciiCode = char.charCodeAt(0);
            const position = {
                x: index, // Space between characters
                y: 0,
                z: 0,
            };
    
            let characterMesh = this.createCharacter(asciiCode, position, this.material);
    
            text.add(characterMesh);

            return characterMesh
      
    }

    removeChar(text, char, index){
        const asciiCode = char.charCodeAt(0);
        const position = {
            x: index, // Space between characters
            y: 0,
            z: 0,
        };

        let characterMesh = this.createCharacter(asciiCode, position, this.material);

        text.remove(characterMesh);
  
}

    
    
    
}

export default MyText

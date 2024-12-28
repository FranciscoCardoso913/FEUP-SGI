import * as THREE from 'three';

/**
 * Converts from {r,g,b} format to hexcode
 * @param {*} rgb color in r,g,b} format
 * @returns color in hexcode
 */
export function rgbToHex(rgb) {
    const toHex = (value) => {
        // Convert to 0-255 range and then to a 2-character hex string
        const hex = Math.round(value * 255).toString(16);
        return hex.padStart(2, '0');
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Converts from degrees to radian
 * @param {*} degrees angle in degrees
 * @returns angle in radian
 */
export function degreesToRadians(degrees) {
    if(!degrees) return null
    return degrees * (Math.PI / 180);
}


/**
 * Creates polygon
 * @param {*} radius radius of the polygon
 * @param {*} stacks 
 * @param {*} slices  
 * @param {*} color_c color in center
 * @param {*} color_p color at the external points
 * @returns polygon mesh
 */
export function createPolygon(radius, stacks, slices, color_c, color_p) {
    const geometry = new THREE.BufferGeometry();

    const positions = [];
    const colors = [];
    const indices = [];

    // Convert colors to arrays
    const centerColor = new THREE.Color(color_c);
    const peripheryColor = new THREE.Color(color_p);

  

    // Add center vertex
    positions.push(0, 0, 0);
    colors.push(centerColor.r, centerColor.g, centerColor.b);

    // Generate vertices and colors
    for (let stack = 0; stack <= stacks; stack++) {
        const r = (stack / stacks) * radius; // Current radius
        for (let slice = 0; slice < slices; slice++) {
            const theta = (slice / slices) * Math.PI * 2; // Angle
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);

            positions.push(x, y, 0);

            // Interpolate color between center and periphery
            const t = stack / stacks;
            const interpolatedColor = centerColor.clone().lerp(peripheryColor, t);
            colors.push(interpolatedColor.r, interpolatedColor.g, interpolatedColor.b);
        }
    }

    // Generate indices for triangles
    for (let slice = 0; slice < slices; slice++) {
        // Connect center to first ring
        indices.push(0, slice + 1, ((slice + 1) % slices) + 1);

        for (let stack = 0; stack < stacks; stack++) {
            const start = 1 + stack * slices;
            const next = start + slices;

            // Create two triangles per quad
            indices.push(
                start + slice, 
                next + slice, 
                next + ((slice + 1) % slices)
            );
            indices.push(
                start + slice, 
                next + ((slice + 1) % slices), 
                start + ((slice + 1) % slices)
            );
        }
    }

    // Assign data to BufferGeometry
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);

    return geometry;
}

/**
 * Loads mipmaps
 * @param {*} parentTexture 
 * @param {*} level level of mipmap 0-7
 * @param {*} path path to the texture
 */
export function loadMipmap(parentTexture, level, path)
{
    // load texture. On loaded call the function to create the mipmap for the specified level 
    new THREE.TextureLoader().load(path, 
        function(mipmapTexture)  // onLoad callback
        {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            ctx.scale(1, 1);
            
            // const fontSize = 48
            const img = mipmapTexture.image         
            canvas.width = img.width;
            canvas.height = img.height

            // first draw the image
            ctx.drawImage(img, 0, 0 )
                         
            // set the mipmap image in the parent texture in the appropriate level
            parentTexture.mipmaps[level] = canvas
        },
        undefined, // onProgress callback currently not supported
        function(err) {
            console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
        }
    )
}

export function parseNodeName(input) {
  
    let regex = /^\s*([a-zA-Z0-9_]+)\s*(?:\(\s*(\$?[a-zA-Z0-9_]+(?:\s*,\s*\$?[a-zA-Z0-9_]+)*)\s*\))?\s*$/;


    let match = input.match(regex);

    if (!match) {
        console.log(input)
        throw new Error("Invalid input string format");
    }

    let name = match[1];
    let params = match[2] ? match[2].split(',') : [];
   
    return { name, params };
}

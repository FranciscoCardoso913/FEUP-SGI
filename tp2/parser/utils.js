import * as THREE from 'three';

export function rgbToHex(rgb) {
    const toHex = (value) => {
        // Convert to 0-255 range and then to a 2-character hex string
        const hex = Math.round(value * 255).toString(16);
        return hex.padStart(2, '0');
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}


export function createPolygon(radius, stacks, slices, color_c, color_p) {
    const geometry = new THREE.BufferGeometry();

    const positions = [];
    const colors = [];
    const indices = [];

    // Convert colors to arrays
    const centerColor = new THREE.Color(color_c);
    const peripheryColor = new THREE.Color(color_p);

    console.log(centerColor)

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

export function rgbToHex(rgb) {
    const toHex = (value) => {
        // Convert to 0-255 range and then to a 2-character hex string
        const hex = Math.round(value * 255).toString(16);
        return hex.padStart(2, '0');
    };
    console.log(`#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`)
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

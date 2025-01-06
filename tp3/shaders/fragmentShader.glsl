uniform sampler2D colorTexture;

varying vec2 vUv;

void main() {
    // Apply the RGB texture
    vec4 color = texture2D(colorTexture, vUv);
    gl_FragColor = color;
}

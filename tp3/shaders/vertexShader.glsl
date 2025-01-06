uniform sampler2D heightTexture;
uniform float displacementScale;

varying vec2 vUv;

void main() {
    vUv = uv;

    // Sample the height map for displacement
    float height = texture2D(heightTexture, uv).r;

    // Displace the vertex along the normal
    vec3 displacedPosition = position + normal * height * displacementScale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}

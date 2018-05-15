varying vec2 vUv;

// uniform float uTime;
// uniform sampler2D tDisplacement;

void main() {

  // vec4 displacementTexture = texture2D(tDisplacement, uv + uTime * .1);

  // vec3 pos = position;
  // pos.z += displacementTexture.r * 100.;

  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

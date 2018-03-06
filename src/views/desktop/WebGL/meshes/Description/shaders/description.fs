uniform sampler2D tDiffuse;
uniform sampler2D tMask;

varying vec2 vUv;

void main() {

  vec4 maskTexture = texture2D(tMask, vUv);
  vec4 texture = texture2D(tDiffuse, vec2(vUv.x + abs( maskTexture.r - 1. ) * 0.21, vUv.y));
  // vec4 texture = texture2D(tDiffuse, vec2(vUv.x + abs( maskTexture.r - 1. ) * 0.05 + abs( maskTexture.g - 1. ) * -0.05, vUv.y));

  vec3 color = texture.rgb;
  float alpha = texture.a * maskTexture.r;
  // float alpha = texture.a * max( maskTexture.r, maskTexture.g );

  gl_FragColor = vec4(color, alpha);
  // gl_FragColor = maskTexture;
}

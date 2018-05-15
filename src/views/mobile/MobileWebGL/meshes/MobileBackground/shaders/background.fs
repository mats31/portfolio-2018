uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {

  vec4 texture = texture2D(tDiffuse, vUv);

  vec3 color = texture.rgb;
  float alpha = texture.a;

  gl_FragColor = vec4(color, alpha);
  // gl_FragColor = vec4(1.,0.,0.,1.);
}

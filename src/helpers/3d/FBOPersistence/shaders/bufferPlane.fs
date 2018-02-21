uniform sampler2D t_diffuse;

varying vec2 vUv;

void main( void ) {

  vec2 uv = vUv;

  vec4 texture = texture2D(t_diffuse, uv);

  vec3 color = texture.rgb * 0.998 - 0.0052;

  float alpha = 1.;

  gl_FragColor = vec4( color, alpha );
}

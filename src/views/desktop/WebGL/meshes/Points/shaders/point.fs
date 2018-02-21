uniform sampler2D t_mask;

varying vec4 vColor;
varying vec3 vPos;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {

  vec4 mask_texture = texture2D(t_mask, gl_PointCoord);

  vec3 color = vColor.rgb;
  float alpha = abs( min( 1., max( 0., map( abs(vPos.z), 0., 900., 0., 1. ) ) ) - 1. ) * mask_texture.r;
  gl_FragColor = vec4(color, alpha);
}

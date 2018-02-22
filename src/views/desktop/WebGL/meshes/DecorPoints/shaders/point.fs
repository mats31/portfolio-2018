uniform sampler2D t_mask;
uniform float u_time;

varying vec3 vPos;
varying float vAlpha;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {

  vec4 mask_texture = texture2D(t_mask, gl_PointCoord);

  vec3 color = vec3(1.);

  float distanceAlpha = abs( min( 1., max( 0., map( abs(vPos.z), 0., 900., 0., 1. ) ) ) - 1. );
  float alpha = distanceAlpha * mask_texture.r * vAlpha;

  gl_FragColor = vec4(color, alpha);
}

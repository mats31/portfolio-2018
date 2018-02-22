uniform sampler2D t_mask;
uniform float u_mask;
uniform float u_time;

varying vec4 vColor;
varying vec4 vRadialColor;
varying vec3 vPos;
varying float vSpeed;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {

  vec4 mask_texture = texture2D(t_mask, gl_PointCoord);

  vec3 color = vColor.rgb;

  float distanceAlpha = abs( min( 1., max( 0., map( abs(vPos.z), 0., 900., 0., 1. ) ) ) - 1. );
  float maskTextureAlpha = min( 1., mask_texture.r + abs( u_mask - 1. ) );

  // float radiusAlpha = abs( smoothstep( 250., 350., abs( vPos.x ) ) - 1. ) * abs( smoothstep( 250., 350., abs( vPos.y ) ) - 1. );
  // float radiusAlphaRandom = abs( step(1., radiusAlpha) - 1. ) * sin( u_time * vSpeed ) + abs( step(1., radiusAlpha) );
  // float alpha = distanceAlpha * maskTextureAlpha * radiusAlpha * radiusAlphaRandom;

  // float alpha = distanceAlpha * maskTextureAlpha * smoothstep( 0.2 + ( sin( u_time * vSpeed ) + 1. / 2. ) * 0.4, 1., vRadialColor.r );
  // float alpha = distanceAlpha * maskTextureAlpha * smoothstep( 0.5 + sin(u_time * 10. * vSpeed) * 0.2, 1., vRadialColor.r );
  float alpha = distanceAlpha * maskTextureAlpha;

  // float alpha = abs( min( 1., max( 0., map( abs(vPos.z), 0., 900., 0., 1. ) ) ) - 1. );
  gl_FragColor = vec4(color, alpha);
}

uniform sampler2D t_mask;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float u_mask;
uniform float u_time;
uniform float u_progress;

varying vec4 vRadialColor;
varying vec3 vPos;
varying float vSpeed;

varying vec4 vColor0;
varying vec4 vColor1;
varying vec4 vColor2;
varying vec4 vColor3;
varying vec4 vColor4;
varying vec4 vColor5;
varying vec4 vColor6;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {

  float dist = distance(gl_FragCoord.xy / uResolution, uMouse);
  float area = abs( smoothstep(0., 0.1, dist) - 1. );

  vec4 mask_texture = texture2D(t_mask, gl_PointCoord);

  // vec3 color = vColor0.rgb * ( smoothstep(0.,0.,u_progress) - smoothstep(0.,1.,u_progress) ) +
  //              vColor1.rgb * ( smoothstep(0.,1.,u_progress) - smoothstep(1.,2.,u_progress) ) +
  //              vColor2.rgb * ( smoothstep(1.,2.,u_progress) - smoothstep(2.,3.,u_progress) ) +
  //              vColor3.rgb * ( smoothstep(2.,3.,u_progress) - smoothstep(3.,4.,u_progress) );

  vec3 color = vColor0.rgb * ( 1. - smoothstep(0.,1.,u_progress) + smoothstep( 6., 7., u_progress) ) +
               vColor1.rgb * ( smoothstep(0.,1.,u_progress) - smoothstep(1.,2.,u_progress) ) +
               vColor2.rgb * ( smoothstep(1.,2.,u_progress) - smoothstep(2.,3.,u_progress) ) +
               vColor3.rgb * ( smoothstep(2.,3.,u_progress) - smoothstep(3., 4., u_progress) ) +
               vColor4.rgb * ( smoothstep(3.,4.,u_progress) - smoothstep(4., 5., u_progress) ) +
               vColor5.rgb * ( smoothstep(4.,5.,u_progress) - smoothstep(5., 6., u_progress) ) +
               vColor6.rgb * ( smoothstep(5.,6.,u_progress) - smoothstep(6., 7., u_progress) );

  // color.r += 1. * area;
  // color = vec3(gl_FragCoord.x / 1364.);

  float distanceAlpha = abs( min( 1., max( 0., map( abs(vPos.z), 0., 900., 0., 1. ) ) ) - 1. );
  float maskTextureAlpha = min( 1., mask_texture.r + abs( u_mask - 1. ) );

  // float radiusAlpha = abs( smoothstep( 250., 350., abs( vPos.x ) ) - 1. ) * abs( smoothstep( 250., 350., abs( vPos.y ) ) - 1. );
  // float radiusAlphaRandom = abs( step(1., radiusAlpha) - 1. ) * sin( u_time * vSpeed ) + abs( step(1., radiusAlpha) );
  // float alpha = distanceAlpha * maskTextureAlpha * radiusAlpha * radiusAlphaRandom;

  // float alpha = distanceAlpha * maskTextureAlpha * smoothstep( 0.2 + ( sin( u_time * vSpeed ) + 1. / 2. ) * 0.4, 1., vRadialColor.r );
  // float alpha = distanceAlpha * maskTextureAlpha * smoothstep( 0.5 + sin(u_time * 10. * vSpeed) * 0.2, 1., vRadialColor.r );
  float pixelAlpha = vColor0.a * ( 1. - smoothstep(0.,1.,u_progress) + smoothstep( 6., 7., u_progress) ) +
               vColor1.a * ( smoothstep(0.,1.,u_progress) - smoothstep(1.,2.,u_progress) ) +
               vColor2.a * ( smoothstep(1.,2.,u_progress) - smoothstep(2.,3.,u_progress) ) +
               vColor3.a * ( smoothstep(2.,3.,u_progress) - smoothstep(3., 4., u_progress) ) +
               vColor4.a * ( smoothstep(3.,4.,u_progress) - smoothstep(4., 5., u_progress) ) +
               vColor5.a * ( smoothstep(4.,5.,u_progress) - smoothstep(5., 6., u_progress) ) +
               vColor6.a * ( smoothstep(5.,6.,u_progress) - smoothstep(6., 7., u_progress) );
  float alpha = distanceAlpha * maskTextureAlpha * pixelAlpha;
  // alpha -= 1. * area;
  // alpha = 1.;

  // float alpha = abs( min( 1., max( 0., map( abs(vPos.z), 0., 900., 0., 1. ) ) ) - 1. );
  gl_FragColor = vec4(color, alpha);
}

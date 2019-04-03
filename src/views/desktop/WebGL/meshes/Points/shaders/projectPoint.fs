uniform sampler2D t_mask;
uniform sampler2D tDiffuse;
uniform float u_mask;
uniform float u_time;
uniform float u_progress;

varying vec3 vPos;
varying vec2 vCoordinates;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {

  vec4 mask_texture = texture2D(t_mask, gl_PointCoord);

  vec2 st0 = vec2(vCoordinates.x / 2048., vCoordinates.y / 2048.);
  vec4 diffuse0 = texture2D(tDiffuse, st0);

  vec2 st1 = vec2( (vCoordinates.x + 512.) / 2048., vCoordinates.y / 2048.);
  vec4 diffuse1 = texture2D(tDiffuse, st1);

  vec2 st2 = vec2( (vCoordinates.x + 1024.) / 2048., vCoordinates.y / 2048.);
  vec4 diffuse2 = texture2D(tDiffuse, st2);

  vec2 st3 = vec2( (vCoordinates.x + 1536.) / 2048., vCoordinates.y / 2048.);
  vec4 diffuse3 = texture2D(tDiffuse, st3);

  vec2 st4 = vec2( vCoordinates.x / 2048., ( vCoordinates.y + 512. ) / 2048.);
  vec4 diffuse4 = texture2D(tDiffuse, st4);

  vec2 st5 = vec2( (vCoordinates.x + 512.) / 2048., ( vCoordinates.y + 512. ) / 2048.);
  vec4 diffuse5 = texture2D(tDiffuse, st5);

  vec2 st6 = vec2( (vCoordinates.x + 1024.) / 2048., ( vCoordinates.y + 512. ) / 2048.);
  vec4 diffuse6 = texture2D(tDiffuse, st6);

  vec2 st7 = vec2( (vCoordinates.x + 1536.) / 2048., ( vCoordinates.y + 512. ) / 2048.);
  vec4 diffuse7 = texture2D(tDiffuse, st7);

  vec2 st8 = vec2(vCoordinates.x / 2048., ( vCoordinates.y + 1024. ) / 2048.);
  vec4 diffuse8 = texture2D(tDiffuse, st8);


  vec4 diffuse = diffuse0 * ( 1. - smoothstep(0.,1.,u_progress) + smoothstep( 8., 9., u_progress) ) +
               diffuse1 * ( smoothstep(0.,1.,u_progress) - smoothstep(1.,2.,u_progress) ) +
               diffuse2 * ( smoothstep(1.,2.,u_progress) - smoothstep(2.,3.,u_progress) ) +
               diffuse3 * ( smoothstep(2.,3.,u_progress) - smoothstep(3., 4., u_progress) ) +
               diffuse4 * ( smoothstep(3.,4.,u_progress) - smoothstep(4., 5., u_progress) ) +
               diffuse5 * ( smoothstep(4.,5.,u_progress) - smoothstep(5., 6., u_progress) ) +
               diffuse6 * ( smoothstep(5.,6.,u_progress) - smoothstep(6., 7., u_progress) ) + 
               diffuse7 * ( smoothstep(6.,7.,u_progress) - smoothstep(7., 8., u_progress) ) +
               diffuse8 * ( smoothstep(7.,8.,u_progress) - smoothstep(8., 9., u_progress) );

  vec3 color = diffuse.rgb;

  float distanceAlpha = abs( min( 1., max( 0., map( abs(vPos.z), 0., 900., 0., 1. ) ) ) - 1. );
  float maskTextureAlpha = min( 1., mask_texture.r + abs( u_mask - 1. ) );

  float pixelAlpha = diffuse.a;
  float alpha = distanceAlpha * maskTextureAlpha * pixelAlpha;

  gl_FragColor = vec4(color, alpha);
}

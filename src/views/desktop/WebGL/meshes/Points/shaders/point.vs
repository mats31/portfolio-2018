uniform float u_delta;

attribute vec4 a_color;

attribute float a_direction;
attribute float a_speed;
attribute float a_select;

varying vec4 vColor;
varying vec3 vPos;

void main() {

  vec3 pos = position;
  pos.z = mod( position.z + ( u_delta * -1. * a_speed ) + 1000., 2000. ) - 1000.;

  pos = mix(pos, position, a_select);

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

  gl_PointSize = ( 2000.0 / length( mvPosition.xyz ) );
  gl_Position = projectionMatrix * mvPosition;

  vColor = a_color;
  vPos = pos;
}

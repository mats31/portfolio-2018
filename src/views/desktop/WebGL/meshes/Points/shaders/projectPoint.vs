uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float u_delta;
uniform float u_time;
uniform float uHide;
uniform float uPress;

attribute vec2 a_coordinates;
attribute float a_direction;
attribute float a_speed;
attribute float a_select;
attribute float a_radius;
attribute float a_offset;
attribute float a_press;

varying vec3 vPos;
varying vec2 vCoordinates;

attribute vec3 a_hidePosition;

mat3 quatToMatrix(vec4 q) {
  mat3 mat;

  float sqw = q.w * q.w;
  float sqx = q.x * q.x;
  float sqy = q.y * q.y;
  float sqz = q.z * q.z;

  // invs (inverse square length) is only required if quaternion is not already normalised
  float invs = 1.0 / (sqx + sqy + sqz + sqw);
  mat[0][0] = ( sqx - sqy - sqz + sqw) * invs; // since sqw + sqx + sqy + sqz =1/invs*invs
  mat[1][1] = (-sqx + sqy - sqz + sqw) * invs;
  mat[2][2] = (-sqx - sqy + sqz + sqw) * invs;

  float tmp1 = q.x * q.y;
  float tmp2 = q.z * q.w;
  mat[1][0] = 2.0 * (tmp1 + tmp2) * invs;
  mat[0][1] = 2.0 * (tmp1 - tmp2) * invs;

  tmp1 = q.x * q.z;
  tmp2 = q.y * q.w;
  mat[2][0] = 2.0 * (tmp1 - tmp2) * invs;
  mat[0][2] = 2.0 * (tmp1 + tmp2) * invs;
  tmp1 = q.y * q.z;
  tmp2 = q.x * q.w;
  mat[2][1] = 2.0 * (tmp1 + tmp2) * invs;
  mat[1][2] = 2.0 * (tmp1 - tmp2) * invs;

  return mat;
}

void main() {

  vec2 viewportMouse = ( uMouse * ( uResolution * 0.5 ) ) * -1.;

  vec3 pos = position;
  pos.x += cos(u_delta * 0.002 * a_speed) * a_radius;
  pos.y += sin(u_delta * 0.002 * a_speed) * a_radius;
  pos.z = mod( position.z + ( u_delta * -1. * a_speed ) + 1000. + a_offset, 2000. ) - 1000.;

  vec3 stablePosition = position;
  stablePosition.x += cos(u_time * 0.2) * 20.;
  stablePosition.y += sin(u_time * 0.3) * 20.;
  stablePosition.z += sin(u_time * 0.6) * 20.;

  float dist = distance(pos.xy, viewportMouse);
  float area = abs( smoothstep(0., 300., dist) - 1. );

  stablePosition.x += 50. * sin( u_time * 10. * a_press) * area * a_direction * uPress;
  stablePosition.y += 50. * sin( u_time * 10. * a_press) * area * a_direction * uPress;
  stablePosition.z += 200. * cos( u_time * 10. * a_press) * area * a_direction * uPress;

  pos = mix( mix(pos, stablePosition, a_select), a_hidePosition, uHide );

  mat3 rotation = quatToMatrix( vec4( 0.,0.,1., sin(u_time * 0.2) * 0.01) );

  vec4 mvPosition = modelViewMatrix * vec4( pos * rotation, 1.0 );

  gl_PointSize = ( 3500.0 / length( mvPosition.xyz ) );
  gl_Position = projectionMatrix * mvPosition;

  vPos = pos;
  vCoordinates = a_coordinates;
}

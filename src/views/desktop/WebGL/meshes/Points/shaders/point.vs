uniform float u_delta;
uniform float u_time;

attribute vec4 a_color;

attribute float a_direction;
attribute float a_speed;
attribute float a_select;
attribute float a_radius;

varying vec4 vColor;
varying vec3 vPos;

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

  vec3 pos = position;
  pos.x += cos(u_delta * 0.002 * a_speed) * a_radius;
  pos.y += sin(u_delta * 0.002 * a_speed) * a_radius;
  pos.z = mod( position.z + ( u_delta * -1. * a_speed ) + 1000., 2000. ) - 1000.;

  vec3 stablePosition = position;
  stablePosition.x += cos(u_time * 0.1) * 20.;
  stablePosition.y += sin(u_time * 0.2) * 20.;
  stablePosition.z += sin(u_time * 0.5) * 20.;

  pos = mix(pos, stablePosition, a_select);

  mat3 rotation = quatToMatrix( vec4( 0.,0.,1., sin(u_time * 0.2) * 0.01) );

  vec4 mvPosition = modelViewMatrix * vec4( pos * rotation, 1.0 );

  gl_PointSize = ( 2000.0 / length( mvPosition.xyz ) );
  // gl_PointSize = .2;
  gl_Position = projectionMatrix * mvPosition;

  vColor = a_color;
  vPos = pos;
}

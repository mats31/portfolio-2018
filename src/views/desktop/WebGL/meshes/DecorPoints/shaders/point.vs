uniform float u_time;
uniform float u_delta;

attribute float a_speed;
attribute float a_offset;
attribute float a_alpha;

varying vec3 vPos;
varying float vAlpha;

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
  pos.z = mod( position.z + ( u_time * 1. * a_speed * 100. + u_delta + a_offset ) + 1000., 2000. ) - 1000.;

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

  gl_PointSize = ( 4000.0 / length( mvPosition.xyz ) );
  gl_Position = projectionMatrix * mvPosition;

  vPos = pos;
  vAlpha = a_alpha;
}

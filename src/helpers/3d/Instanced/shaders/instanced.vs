attribute vec4 a_pos;
attribute vec3 a_scale;
attribute vec4 a_orientation;

varying vec2 vUv;
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

  vec3 pos = a_pos.xyz;

  vec4 orientation = a_orientation;

  mat3 rotation = quatToMatrix(orientation);

  vec4 viewModelPosition = modelViewMatrix * vec4(position * a_scale * rotation + pos, 1.0);
  gl_Position = projectionMatrix * viewModelPosition;

  vUv = uv;
  vAlpha = a_pos.w;
}

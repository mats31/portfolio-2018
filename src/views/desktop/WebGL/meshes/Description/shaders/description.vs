uniform float uTime;
uniform vec2 uOffset;
varying vec2 vUv;

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

  vUv = uv;

  vec3 pos = position;
  pos.z += cos(uTime * 0.2) * 1.;
  pos.y += sin(uTime * 0.2) * .2 + uOffset.y;
  pos.x += sin(uTime * 0.5) * .02 + uOffset.x;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  // gl_Position.z += cos(uTime * 0.1) * -10.;
  // gl_Position.y += sin(uTime * 0.2) * 10.;
  // gl_Position.x += sin(uTime * 0.5) * 10.;
}

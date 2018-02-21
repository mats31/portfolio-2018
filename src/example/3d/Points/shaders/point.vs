void main() {

  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  gl_PointSize = size * ( 10.0 / length( mvPosition.xyz ) );
  gl_Position = projectionMatrix * mvPosition;

}

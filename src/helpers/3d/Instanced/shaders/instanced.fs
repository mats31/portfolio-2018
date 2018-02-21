varying vec2 vUv;
varying float vAlpha;

void main( void ) {

    // vec2 uv = vec2( vOffset + vUv.x * 0.33, vUv.y);
    // vec4 texture = texture2D(tSnowflake, uv);

    vec3 color = vec3( 1., 0., 0. );
    float alpha = vAlpha;

    gl_FragColor = vec4(color, alpha);
}

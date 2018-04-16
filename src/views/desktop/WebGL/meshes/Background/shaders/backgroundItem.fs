uniform sampler2D tDiffuse;
varying vec2 vUv;
varying vec2 vOffset;
varying float vAlpha;

void main( void ) {

    vec2 uv = vec2( vOffset.x + vUv.x * 0.25, vOffset.y + vUv.y * 0.25 );
    vec4 texture = texture2D(tDiffuse, uv);

    // vec3 color = vec3(texture.rgb);
    vec3 color = vec3(texture.a);
    float alpha = texture.a * vAlpha;

    gl_FragColor = vec4(color, alpha);
}

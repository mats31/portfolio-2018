#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float u_alpha;

varying vec2 vUV;
varying vec4 vColor;
varying float vCounters;

void main() {

    // vec4 c = vColor;
    //
    // if( useMap == 1. ) c *= texture2D( map, vUV * repeat );
    // if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;
	// if( c.a < alphaTest ) discard;
    //
    // gl_FragColor = c;,
	// gl_FragColor.a *= step(vCounters,visibility);,

    gl_FragColor = vec4(1.,0.,0.,1.);
}

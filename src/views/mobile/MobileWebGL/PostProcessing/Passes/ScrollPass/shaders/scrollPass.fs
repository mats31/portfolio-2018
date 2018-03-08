uniform sampler2D t_diffuse;
uniform float uFadeIn;
uniform float uFadeOut;
uniform float uDirection;

varying vec2 vUv;

//  Function from Iñigo Quiles
//  www.iquilezles.org/www/articles/functions/functions.htm
float cubicPulse( float c, float w, float x ){
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}


void main() {

    vec3 scrollColor = vec3( cubicPulse( 0.5, uFadeIn, vUv.x ) - cubicPulse( 0.5, uFadeOut, vUv.x ) );
    // vec3 scrollColor = vec3( smoothstep( .1, 1., cubicPulse( 0.5, uFadeIn, vUv.x ) - cubicPulse( 0.5, uFadeOut, vUv.x ) ) );

    // float leftDisplacement = scrollColor.r * abs( step(0.5, vUv.x) - 1. ) * abs( step( 0.5, vUv.x ) * abs(step( 0.5, vUv.x ) - 1.) -1. ;
    float leftDisplacement = scrollColor.r * abs( step(0.5, vUv.x) - 1. );
    // float rightDisplacement = scrollColor.r * step(0.5, vUv.x) * -1. * abs( step( 0.5, vUv.x ) * abs(step( 0.5, vUv.x ) - 1.) -1. ;
    float rightDisplacement = scrollColor.r * step(0.5, vUv.x) * -1.;

    if(vUv.x == 0.5)
    {
        leftDisplacement = 0.;
        rightDisplacement = 0.;
    }

    vec4 diffuse = texture2D( t_diffuse, vec2(vUv.x + leftDisplacement + rightDisplacement, vUv.y) );

    vec3 color = diffuse.rgb;
    float alpha = 1.;

    gl_FragColor = vec4(color, alpha);
    // gl_FragColor = vec4(scrollColor, alpha);
}

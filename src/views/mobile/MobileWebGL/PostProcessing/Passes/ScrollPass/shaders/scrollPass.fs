uniform sampler2D t_diffuse;
uniform float uFadeIn;
uniform float uFadeOut;
uniform float uDirection;
uniform float uFisheye;
uniform vec2 uResolution;

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

    // vec4 diffuse = texture2D( t_diffuse, vec2(vUv.x + leftDisplacement + rightDisplacement, vUv.y) );

    // vec3 color = diffuse.rgb;
    // float alpha = 1.;
    //
    // gl_FragColor = vec4(color, alpha);
    // // gl_FragColor = vec4(scrollColor, alpha);

    float prop = uResolution.x / uResolution.y;//screen proroption
  	vec2 m = vec2(.5);//center coords
  	vec2 d = vUv - m;//vector from center to current fragment
  	float r = sqrt(dot(d, d)); // distance of pixel from center

  	float power = ( 2.0 * 3.141592 / (2.0 * sqrt(dot(m, m))) ) * (uFisheye - 0.5);//amount of effect

  	float bind;//radius of 1:1 effect
  	if (power > 0.0) bind = sqrt(dot(m, m));//stick to corners
  	else {if (prop < 1.0) bind = m.x; else bind = m.y;}//stick to borders

  	//Weird formulas
  	vec2 uv;
  	if (power > 0.0)//fisheye
  		uv = m + normalize(d) * tan(r * power) * bind / tan( bind * power);
  	else if (power < 0.0)//antifisheye
  		uv = m + normalize(d) * atan(r * -power * 10.0) * bind / atan(-power * bind * 10.0);
  	else uv = vUv;//no effect for power = 1.0

  	vec3 col = texture2D(t_diffuse, vec2(uv.x + leftDisplacement + rightDisplacement, uv.y)).xyz;//Second part of cheat
  	                                                  //for round effect, not elliptical
  	gl_FragColor = vec4(col, 1.0);
}

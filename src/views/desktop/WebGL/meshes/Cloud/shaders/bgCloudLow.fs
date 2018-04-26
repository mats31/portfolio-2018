uniform float uTime;
uniform float uActive;
uniform float uOctaves;
uniform float uShapeActive;
uniform sampler2D tMask;
uniform sampler2D tMaskOpacity;
uniform sampler2D tDisplacement;
varying vec2 vUv;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 2
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {

  vec4 displacementTexture = texture2D(tDisplacement, vUv + uTime * 0.1);
  vec4 cloudMaskTexture = texture2D(tDisplacement, vUv + uTime * 0.02);
  vec4 maskTexture = texture2D(tMask, vec2(vUv.x + displacementTexture.r * .05  , vUv.y + displacementTexture.r * .05 ));
  vec4 maskOpacityTexture = texture2D(tMaskOpacity, vec2(vUv.x + displacementTexture.r * .05  , vUv.y + displacementTexture.r * .05 ));

  vec3 firstColor = vec3(0., 146. / 255. , 142. / 255. );
  vec3 secondColor = vec3(0., 33. / 255. , 67. / 255. );

  // vec3 thirdColor = vec3(248. / 255., 208. / 255. , 175. / 255. );
  // vec3 fourthColor = vec3(201. / 255., 132. / 255. , 110. / 255. );
  // vec3 fifthColor = vec3(60. / 255., 65. / 255. , 96. / 255. );

  // vec3 thirdColor = vec3(0., 146. / 255. , 142. / 255. );
  // vec3 fourthColor = vec3(0., 33. / 255. , 67. / 255. );
  // vec3 fifthColor = vec3(0., 89.5 / 255. , 99.5 / 255. );

  vec3 thirdColor = vec3(0./255., 146. / 255. , 142. / 255. );
  vec3 fourthColor = vec3(0./255., 0. / 255. , 37. / 255. );
  vec3 fifthColor = vec3(35./255., 89.5 / 255. , 99.5 / 255. );


  // float noise1 = fbm(vUv * 10. + uTime);
  // float noise2 = fbm(-vUv * 10.);
  // float noise3 = fbm( vUv * vec2(noise1, noise2 ));
  // // vec3 color = vec3(noise);

  vec2 secondQ = vec2(0.);
  secondQ.x = fbm( vUv / 0.05 + 0.0*uTime * 100.);
  // secondQ.y = fbm( vUv / 0.05 + vec2(1.0));

  vec2 secondR = vec2(0.);
  secondR.x = fbm( vUv + 1.0*secondQ + vec2(1.7,5.2)+ 0.5*uTime );
  // secondR.y = fbm( vUv + 1.0*secondQ + vec2(8.3,2.8)+ 0.26*uTime);

  // float secondF = fbm(vUv+secondR);

  // float secondMixValue = clamp((secondF*secondF)*2.5,0.0,2.0);
  // float secondMixValue = clamp((secondR.x*secondR.x)*2.5,0.0,2.0);
  float secondMixValue = clamp((secondR.x*secondR.x)*3.5,0.0,2.0);

  vec3 secondFinalColor = mix(thirdColor, fourthColor, secondMixValue);
  secondFinalColor = mix(fifthColor, secondFinalColor, cloudMaskTexture.r * maskTexture.a);
  secondFinalColor *= maskTexture.a;


  vec2 q = vec2(0.);
  q.x = fbm( vUv + 0.0*uTime);
  q.y = fbm( vUv + vec2(1.0));

  vec2 r = vec2(0.);
  r.x = fbm( vUv + 1.0*q + vec2(1.7,9.2)+ 0.05*uTime );
  r.y = fbm( vUv + 1.0*q + vec2(8.3,2.8)+ 0.026*uTime);

  float f = fbm(vUv+r);
  float mixValue = clamp((f*f)*2.2,0.0,2.0);

  vec3 firstFinalColor = mix(firstColor, mix(secondColor, vec3(0.), clamp(length(r.x),0.0,1.0)), mixValue);
  // firstFinalColor -= max( secondFinalColor.b, max(secondFinalColor.r, secondFinalColor.g) ) * smoothstep(0.99, 1., maskOpacityTexture.a) * uShapeActive;
  firstFinalColor = max( vec3(0.), firstFinalColor );

  vec3 color = mix(firstFinalColor, secondFinalColor, smoothstep(0.43, 1., maskOpacityTexture.a * uActive) );

  // color = mix(color, vec3(0.), clamp(length(q),0.0,1.0));
  // float alpha = 1.;
  float alpha = 1. - max(color.g, max(color.r, color.g) );
  alpha -= smoothstep( max( 0., 0.5 - abs( uActive - 1. ) ), .9 + abs( uActive - 1.), vUv.x );
  alpha -= abs(uActive - 1.) * 0.4;
  // float alpha = 1. * smoothstep( 0., .1, max(max( secondFinalColor.r, secondFinalColor.g), secondFinalColor.b ) );

  // gl_FragColor = displacementTexture;
  gl_FragColor = vec4(color, alpha);
  // gl_FragColor = vec4(maskTexture.r);
}

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

#define OCTAVES 6
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

uniform float uTime;
uniform float uActive;
uniform float uShapeActive;
uniform sampler2D tMask;
uniform sampler2D tMaskOpacity;
uniform sampler2D tDisplacement;
varying vec2 vUv;

void main() {

  vec4 displacementTexture = texture2D(tDisplacement, vUv + uTime * 0.1);

  vec3 firstColor = vec3(0., 146. / 255. , 142. / 255. );
  vec3 secondColor = vec3(0., 33. / 255. , 67. / 255. );


  vec2 q = vec2(0.);
  q.x = fbm( vUv + 0.0*uTime);
  q.y = fbm( vUv + vec2(1.0));

  vec2 r = vec2(0.);
  r.x = fbm( vUv + 1.0*q + vec2(1.7,9.2)+ 0.05*uTime );
  r.y = fbm( vUv + 1.0*q + vec2(8.3,2.8)+ 0.026*uTime);

  float f = fbm(vUv+r);
  float mixValue = clamp((f*f)*2.2,0.0,2.0);

  vec3 firstFinalColor = mix(firstColor, mix(secondColor, vec3(0.), clamp(length(r.x),0.0,1.0)), mixValue);
  firstFinalColor = max( vec3(0.), firstFinalColor );

  vec3 color = firstFinalColor;

  // color = mix(color, vec3(0.), clamp(length(q),0.0,1.0));
  // float alpha = 1.;
  float alpha = 1. - max(color.g, max(color.r, color.g) );
  // alpha -= smoothstep( max( 0., 0.5 - abs( uActive - 1. ) ), .9 + abs( uActive - 1.), vUv.x );
  alpha -= abs(uActive - 1.) * 0.4;
  // float alpha = 1. * smoothstep( 0., .1, max(max( secondFinalColor.r, secondFinalColor.g), secondFinalColor.b ) );

  // gl_FragColor = displacementTexture;
  gl_FragColor = vec4(color, alpha);
  // gl_FragColor = vec4(maskTexture.r);
}

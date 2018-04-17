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
varying vec2 vUv;

void main() {

  vec3 firstColor = vec3(0., 146. / 255. , 142. / 255. );
  vec3 secondColor = vec3(0., 33. / 255. , 67. / 255. );

  // float noise1 = fbm(vUv * 10. + uTime);
  // float noise2 = fbm(-vUv * 10.);
  // float noise3 = fbm( vUv * vec2(noise1, noise2 ));
  // // vec3 color = vec3(noise);

  vec2 q = vec2(0.);
  q.x = fbm( vUv + 0.0*uTime);
  q.y = fbm( vUv + vec2(1.0));

  vec2 r = vec2(0.);
  r.x = fbm( vUv + 1.0*q + vec2(1.7,9.2)+ 0.05*uTime );
  r.y = fbm( vUv + 1.0*q + vec2(8.3,2.8)+ 0.026*uTime);

  float f = fbm(vUv+r);

  float mixValue = clamp((f*f)*2.5,0.0,2.0);

  vec3 color = mix(firstColor, mix(secondColor, vec3(0.), clamp(length(r.x),0.0,1.0)), mixValue);
  // color = mix(color, vec3(0.), clamp(length(q),0.0,1.0));
  // float alpha = 1.;
  float alpha = .9 * smoothstep( 0., .1, max(max( color.r, color.g), color.b ) );

  gl_FragColor = vec4(color, alpha);
}

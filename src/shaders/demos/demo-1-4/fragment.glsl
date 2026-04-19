uniform float uMixFactor;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform vec2 uOffset1;
uniform vec2 uOffset2;
varying vec2 vUv;

void main() {
  vec2 uv1 = vUv + uOffset1;
  vec2 uv2 = vUv + uOffset2;
  vec4 texture1 = texture2D(uTexture1, uv1);
  vec4 texture2 = texture2D(uTexture2, uv2);
  vec3 mixed = mix(texture1.rgb, texture2.rgb, uMixFactor);
  gl_FragColor = vec4(mixed, 1.0);
}
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec2 vUv;

void main() {
  // 根据 UV 坐标和时间的混合
  float mixValue = sin(vUv.x * 3.14159 + uTime) * cos(vUv.y * 3.14159 + uTime * 0.8);
  mixValue = (mixValue + 1.0) / 2.0;
  
  vec3 color = mix(uColorA, uColorB, mixValue);
  
  // 添加一些噪声效果
  float glow = sin(vUv.x * 20.0 + uTime) * sin(vUv.y * 20.0 + uTime);
  color += vec3(glow * 0.2);
  
  gl_FragColor = vec4(color, 1.0);
}
export const baseVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const baseFragmentShader = `
  uniform float iTime;
  uniform vec3 iResolution;
  varying vec2 vUv;

  const float size = 100.0;

  vec2 rotateVec(vec2 v, float a) {
      float b = -a / 180.0 * 3.1415926;
      return vec2(cos(b) * v.x + sin(b) * v.y, cos(b) * v.y - sin(b) * v.x);
  }

  float rand(vec2 n) {
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  vec3 hexHeight(vec2 coord) {
      coord.y /= 0.8660254;
      coord.x = coord.x - 0.5 * coord.y;
      vec2 cellCoord = floor(coord);
      int cellType = int(mod(cellCoord.x - cellCoord.y, 3.0));
      vec2 iCC = mod(coord, 1.0);
      int halfIndex = int(step(1.0, iCC.x + iCC.y));
      float height;
      vec2 center;
      
      if(cellType == 0) {
          center = cellCoord + vec2(1.0, 0.0);
          if(halfIndex == 0) {
              height = iCC.x;
          } else {
              height = 1.0 - iCC.y;
          }
      } else if(cellType == 1) {
          if(halfIndex == 0) {
              center = cellCoord;
              height = 1.0 - iCC.x - iCC.y;
          } else {
              center = cellCoord + vec2(1.0, 1.0);
              height = iCC.x + iCC.y - 1.0;
          }
      } else {
          center = cellCoord + vec2(0.0, 1.0);
          if(halfIndex == 0) {
              height = iCC.y;
          } else {
              height = 1.0 - iCC.x;
          }
      }
      return vec3(height, center);
  }

  float getBrightness(vec2 pos, vec2 offset) {
      vec3 h = hexHeight(rotateVec((pos + iTime) / size, iTime) + offset);
      float b = rand(h.yz) * 0.5 + 0.7;
      float a = step(3.0 * sin(iTime/4.0 + b * 1000.0) - 2.0, h.x);
      return 1.0 - a*b;
  }

  float getLayeredBrightness(vec2 pos) {
      float brightness = getBrightness(pos, vec2(0.0));
      for(int i = 1; i <= 12; i ++) {
          float factor = 0.4/float(i);
          vec2 dir = vec2(mod(float(i), 2.0), mod(float(i+1), 2.0)) * (mod(floor(float(i)/2.0), 2.0) * 2.0 - 1.0);
          vec2 offset = vec2(floor(float(i+3)/4.0) * size + 1.0) * dir;
          brightness += factor * clamp(getBrightness(pos, offset) - 0.2, 0.0, 1.0);
      }
      return brightness;
  }

  vec2 glitchFilter(vec2 pos, float seed) {
      float r = rand(vec2(floor(iTime*10.0), floor(pos.y/ 60.0)));
      if(r <= 0.1) pos.x += 300.0 * r * seed;
      return pos;
  }

  vec4 getColor(vec2 pos) {
      float red = getLayeredBrightness(glitchFilter(pos, 1.0));
      float cyan = getLayeredBrightness(glitchFilter(pos, 1.4));
      return vec4(red, cyan, cyan, 1.0);
  }

  void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      gl_FragColor = getColor(fragCoord.xy);
  }
`;
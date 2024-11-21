export const abstractVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const abstractFragmentShader = `
uniform float iTime;
uniform vec3 iResolution;
varying vec2 vUv;

const float size = 200.0; // Increased size for larger hexagons

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec3 hexHeight(vec2 coord) {
    coord.y /= 0.8660254; // Hexagon ratio
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
    // Removed rotation, simplified movement
    vec3 h = hexHeight((pos + vec2(iTime * 30.0, 0.0)) / size + offset);
    float b = rand(h.yz) * 0.4 + 0.6; // Adjusted contrast
    float a = step(2.5 * sin(iTime/5.0 + b * 800.0) - 1.5, h.x);
    return 1.0 - a*b;
}

float getLayeredBrightness(vec2 pos) {
    float brightness = getBrightness(pos, vec2(0.0));
    for(int i = 1; i <= 8; i ++) { // Reduced layers for larger patterns
        float factor = 0.3/float(i);
        vec2 dir = vec2(mod(float(i), 2.0), mod(float(i+1), 2.0)) * (mod(floor(float(i)/2.0), 2.0) * 2.0 - 1.0);
        vec2 offset = vec2(floor(float(i+3)/4.0) * size + 1.0) * dir;
        brightness += factor * clamp(getBrightness(pos, offset) - 0.2, 0.0, 1.0);
    }
    return brightness;
}

vec2 glitchFilter(vec2 pos, float seed) {
    float r = rand(vec2(floor(iTime*8.0), floor(pos.y/ 80.0))); // Adjusted glitch scale
    if(r <= 0.08) pos.x += 200.0 * r * seed; // Reduced glitch frequency
    return pos;
}

vec4 getColor(vec2 pos) {
    float red = getLayeredBrightness(glitchFilter(pos, 1.0));
    float cyan = getLayeredBrightness(glitchFilter(pos, 1.2));
    return vec4(red, cyan, cyan, 1.0);
}

void main() {
    vec2 fragCoord = vUv * iResolution.xy;
    gl_FragColor = getColor(fragCoord.xy);
}
`
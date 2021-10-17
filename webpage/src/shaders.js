var flatVertCode = `
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;

attribute vec4 a_pos;
attribute vec4 a_col;
attribute vec4 a_nor;

varying vec4 v_col;
varying vec3 v_position;

void main(void) {
    v_col = a_col;

    vec4 modelPosition = u_model * a_pos;
    v_position = (u_view * modelPosition).xyz;
    gl_Position = u_proj * u_view * modelPosition;
}
`;

var flatFragCode = `
precision mediump float;
varying vec4 v_col;
varying vec3 v_position;

void main(void) {
    float fogDistance = length(v_position);
    float fogAmount = smoothstep(800.0, 950.0, fogDistance);

    vec4 fogColor = vec4(1, 1, 1, 1);
    gl_FragColor = mix(v_col, fogColor, fogAmount);
}
`;

var lambertVertCode = `
precision mediump float;

uniform mat4 u_model;
uniform mat4 u_modelInvTr;
uniform mat4 u_view;
uniform mat4 u_viewInv;
uniform mat4 u_proj;

attribute vec4 a_pos;
attribute vec4 a_nor;
attribute vec4 a_col;

varying vec4 v_pos;
varying vec4 v_nor;         // The array of normals that has been transformed by u_ModelInvTr.
varying vec4 v_lightVec;    // The direction in which our virtual light lies, relative to each vertex.
varying vec4 v_col;

varying vec3 v_position;

// The direction of our virtual light, which is used to compute the shading of
// the geometry in the fragment shader.
const vec4 lightDir = normalize(vec4(1, 1, 1, 0));  

void main() {
    v_pos = a_pos;
    v_col = a_col;

    mat3 invTranspose = mat3(u_modelInvTr);
    v_nor = vec4(invTranspose * vec3(a_nor), 0);

    vec4 modelPosition = u_model * a_pos; 
    v_lightVec = lightDir; // u_viewInv * lightDir;

    v_position = (u_view * modelPosition).xyz;

    gl_Position = u_proj * u_view * modelPosition;
}
`;

var lambertFragCode = `
precision mediump float;

uniform vec4 u_camPos;
uniform int u_time;

varying vec4 v_pos;
varying vec4 v_nor;
varying vec4 v_col;
varying vec4 v_lightVec;

varying vec3 v_position;

// sun rotation around x axis given point and angle
vec4 rotateX(vec4 p, float a) {
    return normalize(abs(vec4(p.x, cos(a) * p.y - sin(a) * p.z, sin(a) * p.y + cos(a) * p.z, 0.0)));
}

void main() {
    // Material base color (before shading)
    vec4 diffuseColor = v_col;

    // float timeFloat = float(u_time);
    // vec4 sunVec = rotateX(normalize(v_lightVec), timeFloat * 0.001);
    vec4 sunVec = normalize(v_lightVec);

    float diffuseTerm = dot(normalize(v_nor), sunVec);
    diffuseTerm = clamp(diffuseTerm, 0.0, 1.0);

    float ambientTerm = 1.0;
    float lightIntensity = ambientTerm + diffuseTerm;

    float fogDistance = length(v_position);
    float fogAmount = smoothstep(800.0, 950.0, fogDistance);
    vec4 fogColor = vec4(1, 1, 1, 1);
    gl_FragColor = mix(vec4(diffuseColor.rgb * lightIntensity, diffuseColor.a), fogColor, fogAmount);
}
`;

export { flatVertCode, flatFragCode, lambertVertCode, lambertFragCode };
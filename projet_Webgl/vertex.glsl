precision mediump float;

attribute vec4 position;
attribute vec4 color;
varying vec4 vColor;
uniform mat4 projection;
uniform mat4 modele;
uniform mat4 transform;

void main() {
    gl_Position = (projection) * (modele) * (transform) * (position);
    vColor = color;
}
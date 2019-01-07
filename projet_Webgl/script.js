let canvas, gl, program;
let attribPos, attribColor;

let buffer, bufferColor, indexBuffer;
let projection = mat4.create();
let modele = mat4.create();
let transform = mat4.create();

let cubePosInCanvas = [];
let colors = [];
let indices = [];

let rxValue = 0;
let ryValue = 0;
let rzValue = 0;

let txValue = 0;
let tyValue = 0;
let tzValue = 0;

let zoomValue = 1
let perspectiveValue = 30;

let sliderZoom
let perspectiveSlider;
let sliderRX; 
let sliderRY;
let sliderRZ;
let sliderTX;
let sliderTY; 
let sliderTZ;

let colorsTab = [{
        r: 0.0,
        g: 1.0,
        b: 1.0
    },
    {
        r: 1.0,
        g: 0.0,
        b: 1.0
    },
    {
        r: 1.0,
        g: 0.0,
        b: 0.0
    },
    {
        r: 0.0,
        g: 0.0,
        b: 1.0
    },
    {
        r: 0.0,
        g: 1.0,
        b: 0.0
    },
    {
        r: 1.0,
        g: 1.0,
        b: 0.0
    }
];

function degree2Radians(degrees) {
    let pi = Math.PI;
    return degrees * (pi / 180);
}


function updateSliderText(id, value) {
    document.getElementById(id).textContent = value;
}

function refreshMatrixTransform() {

    mat4.translate(modele, mat4.create(), [-0.0, 0.0, -10.0]);
    mat4.scale(modele, modele, [zoomValue, zoomValue, 1]);
    mat4.perspective(projection, degree2Radians(perspectiveValue), 1, 0.1, 1000);

    transform = mat4.create();
    mat4.rotateX(transform, transform, rxValue);
    mat4.rotateY(transform, transform, ryValue);
    mat4.rotateZ(transform, transform, rzValue);
    mat4.translate(transform, transform, [txValue, tyValue, tzValue]);
}

function initContext() {
    canvas = document.getElementById('canvas-cube');

    sliderZoom = document.getElementById('zoom');
    perspectiveSlider = document.getElementById('perspective');

    sliderTX = document.getElementById('tx');
    sliderTY = document.getElementById('ty');
    sliderTZ = document.getElementById('tz');

    sliderRX = document.getElementById('rx');
    sliderRY = document.getElementById('ry');
    sliderRZ = document.getElementById('rz');

    gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('error');
        return;
    }
    gl.clearColor(0, 0, 0, 1.0);
}

function loadText(url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.overrideMimeType("text/plain");
    xhr.send(null);
    if (xhr.status === 200)
        return xhr.responseText;
    else {
        return null;
    }
}

function initShaders() {
    let fragmentSource = loadText('fragment.glsl');
    let vertexSource = loadText('vertex.glsl');

    let fragment = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment, fragmentSource);
    gl.compileShader(fragment);

    let vertex = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex, vertexSource);
    gl.compileShader(vertex);

    gl.getShaderParameter(fragment, gl.COMPILE_STATUS);
    gl.getShaderParameter(vertex, gl.COMPILE_STATUS);

    if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(fragment));
    }

    if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertex));
    }

    program = gl.createProgram();
    gl.attachShader(program, fragment);
    gl.attachShader(program, vertex);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Could not initialise shaders");
    }
    gl.useProgram(program);
}

function applyColorsOnCube() {
    let colorApply;
    const colorsFaces = [
        [colorsTab[0].r, colorsTab[0].g, colorsTab[0].b, 1.0], 
        [colorsTab[1].r, colorsTab[1].g, colorsTab[1].b, 1.0],
        [colorsTab[2].r, colorsTab[2].g, colorsTab[2].b, 1.0],
        [colorsTab[3].r, colorsTab[3].g, colorsTab[3].b, 1.0], 
        [colorsTab[4].r, colorsTab[4].g, colorsTab[4].b, 1.0], 
        [colorsTab[5].r, colorsTab[5].g, colorsTab[5].b, 1.0]
    ];

    for (let i = 0; i < colorsFaces.length; i++) {
        colorApply = colorsFaces[i];
        colors = colors.concat(colorApply, colorApply, colorApply, colorApply);
    }
}

function cubeGeneration() {

    mat4.translate(modele, modele, [-0.0, 0.0, -10.0]);

    mat4.perspective(projection, degree2Radians(30), 1, 0.1, 1000);

    cubePosInCanvas = [
        // Avant
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Arrière
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Haut
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        // Bas
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Droite
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Gauche
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ];
    indices = [
        0, 1, 2, 0, 2, 3, // devant
        4, 5, 6, 4, 6, 7, // derrière
        8, 9, 10, 8, 10, 11, // haut
        12, 13, 14, 12, 14, 15, // bas
        16, 17, 18, 16, 18, 19, // droite
        20, 21, 22, 20, 22, 23, // gauche
    ];
    applyColorsOnCube();
}

function initBuffers() {
    attribPos = gl.getAttribLocation(program, "position");
    attribColor = gl.getAttribLocation(program, "color");

    //On utilise deux buffer

    bufferColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribColor);
    gl.vertexAttribPointer(attribColor, 4, gl.FLOAT, true, 0, 0);

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubePosInCanvas), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribPos);
    gl.vertexAttribPointer(attribPos, 3, gl.FLOAT, true, 0, 0);

    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

function initEvents() {

    //Event de zoom
    sliderZoom.oninput = function () {
        zoomValue = this.value;
        refreshMatrixTransform();
        updateSliderText("valueZoom", zoomValue);
    }
    //Event de perspective (fov)
    perspectiveSlider.oninput = function () {
        perspectiveValue = this.value;
        refreshMatrixTransform();
        updateSliderText("valuePerspective", this.value);
    }
    //Event de translation
    sliderTX.oninput = function () {
        txValue = this.value;
        refreshMatrixTransform();
        updateSliderText("valueTX", this.value);
    }
    sliderTY.oninput = function () {
        tyValue = this.value;
        refreshMatrixTransform();
        updateSliderText("valueTY", this.value);
    }
    sliderTZ.oninput = function () {
        tzValue = this.value;
        refreshMatrixTransform();
        updateSliderText("valueTZ", this.value);
    }

    //Event de rotation
    sliderRX.oninput = function () {
        rxValue = this.value;
        refreshMatrixTransform();
        updateSliderText("valueRX", this.value);

    }
    sliderRY.oninput = function () {
        ryValue = this.value;
        refreshMatrixTransform();

        updateSliderText("valueRY", this.value);
    }
    sliderRZ.oninput = function () {
        rzValue = this.value;
        refreshMatrixTransform();

        updateSliderText("valueRZ", this.value);
    }
}

function draw() {

    let attrProjection = gl.getUniformLocation(program, "projection");
    let attrModele = gl.getUniformLocation(program, "modele");
    let attrTransform = gl.getUniformLocation(program, "transform");
    gl.uniformMatrix4fv(attrProjection, false, projection);
    gl.uniformMatrix4fv(attrModele, false, modele);
    gl.uniformMatrix4fv(attrTransform, false, transform);

    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    window.requestAnimationFrame(draw);
}

function main() {
    initContext();
    initShaders();
    cubeGeneration();
    initBuffers();
    initEvents();
    window.requestAnimationFrame(draw);
}
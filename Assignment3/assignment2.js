"use strict";

var canvas;
var gl;

var positions = vec3(0, 0, 0);
var theta = vec3(0, 0, 0);
var rotateTheta = 0;
var windspeed = 0.5;
var scale = 1;
var vPosition, modelView, projection,colorLocation;

var fovy = 45.0; 
var aspect;
var near = 1.0;
var far = -1.0;
var eye = vec3(0.0, 0.0, 5.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var red, green, blue;


var zeminBuffer;
var zemin = [
    vec3(1, -1, 1),
    vec3(-1, -1, 1),
    vec3(1, -1, -1),
    vec3(-1, -1, -1)
];

var koniBuffer;
var koni = [        //hexagon points 

    vec3(-0.1, -1, 0.2),
    vec3(0.1, -1, 0.2),
    vec3(0.0, -0.15, 0),

    vec3(0.1, -1, 0.2),
    vec3(0.2, -1, 0.1),
    vec3(0.0, -0.15, 0),

    vec3(0.2, -1, -0.1),
    vec3(0.2, -1, 0.1),
    vec3(0.0, -0.15, 0),

    vec3(0.1, -1, -0.2),
    vec3(0.2, -1, -0.1),
    vec3(0.0, -0.15, 0),

    vec3(-0.1, -1, -0.2),
    vec3(0.1, -1, -0.2),
    vec3(0.0, -0.15, 0),

    vec3(-0.1, -1, -0.2),
    vec3(-0.2, -1, -0.1),
    vec3(0.0, -0.15, 0),

    vec3(-0.2, -1, -0.1),
    vec3(-0.2, -1, 0.1),
    vec3(0.0, -0.15, 0),

    vec3(-0.2, -1, 0.1),
    vec3(-0.1, -1, 0.2),
    vec3(0.0, -0.15, 0)
];

var cubukBuffer;
var cubuk = [
    vec3(0.01, -0.2, 0.0),//right
    vec3(0.02, -0.25, 0.0),//left
    vec3(0, -0.225, 0.25),//point

    vec3(-0.01, -0.2, 0.0),//right
    vec3(0.01, -0.2, 0.0),//left
    vec3(0, -0.225, 0.25),//point

    vec3(0.02, -0.25, 0.0),//right
    vec3(-0.02, -0.25, 0.0),//left   
    vec3(0, -0.225, 0.25),//point

    vec3(-0.01, -0.2, 0.0),//right
    vec3(-0.02, -0.25, 0.0),//left
    vec3(0, -0.225, 0.25),//point

];

var rect1Buffer;
var rect1 = [
    vec3(0.04, 0, 0.13),
    vec3(-0.04, 0, 0.17),
    vec3(0.04, 0.35, 0.13),
    vec3(-0.04, 0.35, 0.17)
];

var rect2Buffer;
var rect2 = [
    vec3(-0.02, 0.035, 0.13),
    vec3(0.02, -0.035, 0.17),
    vec3(-0.32, -0.14, 0.13),
    vec3(-0.28, -0.21, 0.17)
];

var rect3Buffer;
var rect3 = [
    vec3(0.02, 0.035, 0.17),
    vec3(-0.02, -0.035, 0.13),
    vec3(0.32, -0.14, 0.17),
    vec3(0.28, -0.21, 0.13)
];

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    aspect = canvas.width / canvas.height;

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    gl.enable(gl.DEPTH_TEST);

    zeminBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, zeminBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(zemin), gl.STATIC_DRAW);

    koniBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, koniBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(koni), gl.STATIC_DRAW);

    cubukBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubukBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cubuk), gl.STATIC_DRAW);

    rect1Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rect1Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(rect1), gl.STATIC_DRAW);
    rect2Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rect2Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(rect2), gl.STATIC_DRAW);
    rect3Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rect3Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(rect3), gl.STATIC_DRAW);


    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelView = gl.getUniformLocation(program, "modelView");
    projection = gl.getUniformLocation(program, "projection");
    colorLocation = gl.getUniformLocation(program, "color");


    document.getElementById("inp_fovy").oninput = function (event) {
        fovy = event.target.value;
    };
    document.getElementById("inp_camp_X").oninput = function (event) {
        eye[0] = event.target.value;
    };
    document.getElementById("inp_camp_Y").oninput = function (event) {
        eye[1] = event.target.value;
    };
    document.getElementById("inp_camp_Z").oninput = function (event) {
        eye[2] = event.target.value;
    };
    document.getElementById("inp_camt_X").oninput = function (event) {
        at[0] = event.target.value;
    };
    document.getElementById("inp_camt_Y").oninput = function (event) {
        at[1] = event.target.value;
    };
    document.getElementById("inp_camt_Z").oninput = function (event) {
        at[2] = event.target.value;
    };
    document.getElementById("inp_objX").oninput = function (event) {
        positions[0] = event.target.value;
    };
    document.getElementById("inp_objY").oninput = function (event) {
        positions[1] = event.target.value;
    };
    document.getElementById("inp_objZ").oninput = function (event) {
        positions[2] = event.target.value;
    };
    document.getElementById("inp_obj_scale").oninput = function (event) {
        scale = event.target.value;
    };
    document.getElementById("inp_obj_rotationX").oninput = function (event) {
        theta[0] = event.target.value;
    };
    document.getElementById("inp_obj_rotationY").oninput = function (event) {
        theta[1] = event.target.value;
    };
    document.getElementById("inp_obj_rotationZ").oninput = function (event) {
        theta[2] = event.target.value;
    };
    document.getElementById("inp_wing_speed").oninput = function (event) {
        windspeed = event.target.value;
    };
    document.getElementById("redSlider").oninput = function (event) {
        red = event.target.value;
    };
    document.getElementById("greenSlider").oninput = function (event) {
        green = event.target.value;
    };
    document.getElementById("blueSlider").oninput = function (event) {
        blue = event.target.value;
    };

    render();
};


function render() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mvMatrix = lookAt(eye, at, up);
    var pMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, zeminBuffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4f(colorLocation, 0.7, 0.7, 0.5, 1.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    mvMatrix = mult((mult(translate(positions[0], positions[1], positions[2]), mvMatrix)), translate(0, 0, 0));
    mvMatrix = mult(mvMatrix, scalem(scale, scale, scale));
    mvMatrix = mult(mvMatrix, rotateX(theta[0]));
    mvMatrix = mult(mvMatrix, rotateY(theta[1]));
    mvMatrix = mult(mvMatrix, rotateZ(theta[2]));

    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, koniBuffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4f(colorLocation, red, green, blue, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, (koni.length));

    gl.bindBuffer(gl.ARRAY_BUFFER, cubukBuffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4f(colorLocation, red, green, blue, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, (cubuk.length));

    mvMatrix = mult(mvMatrix, translate(0, -0.225, 0));
    mvMatrix = mult(mvMatrix, rotateZ(rotateTheta));
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(projection, false, flatten(pMatrix));
    rotateTheta = rotateTheta + windspeed % 2.1;

    gl.bindBuffer(gl.ARRAY_BUFFER, rect1Buffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4f(colorLocation, 1, 0, 0, 1.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, rect2Buffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4f(colorLocation, 0, 1, 0, 1.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, rect3Buffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4f(colorLocation, 0, 0, 1, 1.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


    window.requestAnimFrame(render);
}

"use strict";

var canvas;
var gl;

var program;
var positions = vec3(0, 0, 0);
var theta = vec3(0, 0, 0);
var rotateTheta = 0;
var windspeed = 0.5;
var scale = 1;
var vPosition, modelView, projection,colorLocation;
var nBuffer;
var mDiffuseSlider = vec4(0.0,0.0,0.0,1.0);
var mSpecularSlider = vec4(0.0,0.0,0.0,1.0);
var mAmbientSlider = vec4(0.0,0.0,0.0,1.0);
var shiny = 1;

var normalsArray = [];

var fovy = 45.0; 
var aspect;
var near = 1.0;
var far = -1.0;
var eye = vec3(0.0, 0.0, 5.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var red, green, blue;
//-------------------------------------------------------------------------Light properties
var lightPosition = vec4(0.0, 0.0, 5.0, 0.0 );
var lightAmbient = vec4(0.0, 0.0, 0.0, 0.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
//-------------------------------------------------------------------------Material Properties
var materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0 );
var materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 1.0;

var ambientProduct;
var diffuseProduct;
var specularProduct;


var zeminBuffer;
var zemin = [
    vec3(1, -1, 1),
    vec3(-1, -1, 1),
    vec3(1, -1, -1),
    vec3(-1, -1, -1)
];

var koniBuffer;
var koni = [        //hexagon points 

    vec3(-0.1, -1.0, 0.2),
    vec3(0.1, -1.0, 0.2),
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

var normalsOfAll = [
    
    cross(subtract(vec3(-1.0, -1.0, 1.0),vec3(1.0, -1.0, 1.0)),subtract(vec3(1.0, -1.0, -1.0),vec3(-1.0, -1.0, 1.0))),
    cross(subtract(vec3(-1.0, -1.0, 1.0),vec3(1.0, -1.0, 1.0)),subtract(vec3(1.0, -1.0, -1.0),vec3(-1.0, -1.0, 1.0))),
    cross(subtract(vec3(-1.0, -1.0, 1.0),vec3(1.0, -1.0, 1.0)),subtract(vec3(1.0, -1.0, -1.0),vec3(-1.0, -1.0, 1.0))),
    cross(subtract(vec3(-1.0, -1.0, 1.0),vec3(1.0, -1.0, 1.0)),subtract(vec3(1.0, -1.0, -1.0),vec3(-1.0, -1.0, 1.0))),
    
    
    //koni------------------------------------------------------------------------------------------------------

    cross(subtract(vec3(0.1, -1, 0.2),vec3(0.0, -0.15, 0)),subtract(vec3(-0.1, -1, 0.2),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(0.1, -1, 0.2),vec3(0.0, -0.15, 0)),subtract(vec3(-0.1, -1, 0.2),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(0.1, -1, 0.2),vec3(0.0, -0.15, 0)),subtract(vec3(-0.1, -1, 0.2),vec3(0.0, -0.15, 0))),
    
    cross(subtract(vec3(0.2, -1, 0.1),vec3(0.0, -0.15, 0)),subtract(vec3(0.1, -1, 0.2),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(0.2, -1, 0.1),vec3(0.0, -0.15, 0)),subtract(vec3(0.1, -1, 0.2),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(0.2, -1, 0.1),vec3(0.0, -0.15, 0)),subtract(vec3(0.1, -1, 0.2),vec3(0.0, -0.15, 0))),
    
    cross(subtract(vec3(0.2, -1, 0.1),vec3(0.0, -0.15, 0)),subtract(vec3(0.2, -1, -0.1),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(0.2, -1, 0.1),vec3(0.0, -0.15, 0)),subtract(vec3(0.2, -1, -0.1),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(0.2, -1, 0.1),vec3(0.0, -0.15, 0)),subtract(vec3(0.2, -1, -0.1),vec3(0.0, -0.15, 0))),

    cross(subtract(vec3(0.2, -1, -0.1),vec3(0.0, -0.15, 0)),subtract(vec3(0.1, -1, -0.2),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(0.2, -1, -0.1),vec3(0.0, -0.15, 0)),subtract(vec3(0.1, -1, -0.2),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(0.2, -1, -0.1),vec3(0.0, -0.15, 0)),subtract(vec3(0.1, -1, -0.2),vec3(0.0, -0.15, 0))),

    cross(subtract(vec3(0.1, -1, -0.2),vec3(0.0, -0.15, 0)),subtract(vec3(-0.1, -1, -0.2),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(0.1, -1, -0.2),vec3(0.0, -0.15, 0)),subtract(vec3(-0.1, -1, -0.2),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(0.1, -1, -0.2),vec3(0.0, -0.15, 0)),subtract(vec3(-0.1, -1, -0.2),vec3(0.0, -0.15, 0))),

    cross(subtract(vec3(-0.2, -1, -0.1),vec3(0.0, -0.15, 0)),subtract(vec3(-0.1, -1, -0.2),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(-0.2, -1, -0.1),vec3(0.0, -0.15, 0)),subtract(vec3(-0.1, -1, -0.2),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(-0.2, -1, -0.1),vec3(0.0, -0.15, 0)),subtract(vec3(-0.1, -1, -0.2),vec3(0.0, -0.15, 0))),

    cross(subtract(vec3(-0.2, -1, 0.1),vec3(0.0, -0.15, 0)),subtract(vec3(-0.2, -1, -0.1),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(-0.2, -1, 0.1),vec3(0.0, -0.15, 0)),subtract(vec3(-0.2, -1, -0.1),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(-0.2, -1, 0.1),vec3(0.0, -0.15, 0)),subtract(vec3(-0.2, -1, -0.1),vec3(0.0, -0.15, 0))),

    cross(subtract(vec3(-0.1, -1, 0.2),vec3(0.0, -0.15, 0)),subtract(vec3(-0.2, -1, 0.1),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(-0.1, -1, 0.2),vec3(0.0, -0.15, 0)),subtract(vec3(-0.2, -1, 0.1),vec3(0.0, -0.15, 0))),
    cross(subtract(vec3(-0.1, -1, 0.2),vec3(0.0, -0.15, 0)),subtract(vec3(-0.2, -1, 0.1),vec3(0.0, -0.15, 0))),

    

    //cubuk---------------------------------------------------------------------------------------------------------------
    
    cross(subtract(vec3(0.02, -0.25, 0.0),vec3(0, -0.225, 0.25)),subtract(vec3(0.01, -0.2, 0.0),vec3(0, -0.225, 0.25))),
    cross(subtract(vec3(0.02, -0.25, 0.0),vec3(0, -0.225, 0.25)),subtract(vec3(0.01, -0.2, 0.0),vec3(0, -0.225, 0.25))),
    cross(subtract(vec3(0.02, -0.25, 0.0),vec3(0, -0.225, 0.25)),subtract(vec3(0.01, -0.2, 0.0),vec3(0, -0.225, 0.25))),

    cross(subtract(vec3(0.01, -0.2, 0.0),vec3(0, -0.225, 0.25)),subtract(vec3(-0.01, -0.2, 0.0),vec3(0, -0.225, 0.25))),
    cross(subtract(vec3(0.01, -0.2, 0.0),vec3(0, -0.225, 0.25)),subtract(vec3(-0.01, -0.2, 0.0),vec3(0, -0.225, 0.25))),
    cross(subtract(vec3(0.01, -0.2, 0.0),vec3(0, -0.225, 0.25)),subtract(vec3(-0.01, -0.2, 0.0),vec3(0, -0.225, 0.25))),

    cross(subtract(vec3(-0.02, -0.25, 0.0),vec3(0, -0.225, 0.25)),subtract(vec3(0.02, -0.25, 0.0),vec3(0, -0.225, 0.25))),
    cross(subtract(vec3(-0.02, -0.25, 0.0),vec3(0, -0.225, 0.25)),subtract(vec3(0.02, -0.25, 0.0),vec3(0, -0.225, 0.25))),
    cross(subtract(vec3(-0.02, -0.25, 0.0),vec3(0, -0.225, 0.25)),subtract(vec3(0.02, -0.25, 0.0),vec3(0, -0.225, 0.25))),

    cross(subtract(vec3(-0.02, -0.25, 0.0),vec3(0, -0.225, 0.25)),subtract(vec3(-0.01, -0.2, 0.0),vec3(0, -0.225, 0.25))),
    cross(subtract(vec3(-0.02, -0.25, 0.0),vec3(0, -0.225, 0.25)),subtract(vec3(-0.01, -0.2, 0.0),vec3(0, -0.225, 0.25))),
    cross(subtract(vec3(-0.02, -0.25, 0.0),vec3(0, -0.225, 0.25)),subtract(vec3(-0.01, -0.2, 0.0),vec3(0, -0.225, 0.25))),

    //rect1
    cross(subtract(vec3(-0.04, 0, 0.17),vec3(0.04, 0, 0.13)),subtract(vec3(0.04, 0.35, 0.13),vec3(-0.04, 0, 0.17))),
    cross(subtract(vec3(-0.04, 0, 0.17),vec3(0.04, 0, 0.13)),subtract(vec3(0.04, 0.35, 0.13),vec3(-0.04, 0, 0.17))),
    cross(subtract(vec3(-0.04, 0, 0.17),vec3(0.04, 0, 0.13)),subtract(vec3(0.04, 0.35, 0.13),vec3(-0.04, 0, 0.17))),
    cross(subtract(vec3(-0.04, 0, 0.17),vec3(0.04, 0, 0.13)),subtract(vec3(0.04, 0.35, 0.13),vec3(-0.04, 0, 0.17))),

    //rect2
    cross(subtract(vec3(0.02, -0.035, 0.17),vec3(-0.02, 0.035, 0.13)),subtract(vec3(-0.32, -0.14, 0.13),vec3(0.02, -0.035, 0.17))),
    cross(subtract(vec3(0.02, -0.035, 0.17),vec3(-0.02, 0.035, 0.13)),subtract(vec3(-0.32, -0.14, 0.13),vec3(0.02, -0.035, 0.17))),
    cross(subtract(vec3(0.02, -0.035, 0.17),vec3(-0.02, 0.035, 0.13)),subtract(vec3(-0.32, -0.14, 0.13),vec3(0.02, -0.035, 0.17))),
    cross(subtract(vec3(0.02, -0.035, 0.17),vec3(-0.02, 0.035, 0.13)),subtract(vec3(-0.32, -0.14, 0.13),vec3(0.02, -0.035, 0.17))),

    //rect3
    cross(subtract(vec3(-0.02, -0.035, 0.13),vec3(0.02, 0.035, 0.17)),subtract(vec3(0.32, -0.14, 0.17),vec3(-0.02, -0.035, 0.13))),
    cross(subtract(vec3(-0.02, -0.035, 0.13),vec3(0.02, 0.035, 0.17)),subtract(vec3(0.32, -0.14, 0.17),vec3(-0.02, -0.035, 0.13))),
    cross(subtract(vec3(-0.02, -0.035, 0.13),vec3(0.02, 0.035, 0.17)),subtract(vec3(0.32, -0.14, 0.17),vec3(-0.02, -0.035, 0.13))),
    cross(subtract(vec3(-0.02, -0.035, 0.13),vec3(0.02, 0.035, 0.17)),subtract(vec3(0.32, -0.14, 0.17),vec3(-0.02, -0.035, 0.13))),


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
    program = initShaders(gl, "vertex-shader", "fragment-shader");
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

    nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsOfAll), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    modelView = gl.getUniformLocation(program, "modelView");
    projection = gl.getUniformLocation(program, "projection");
    colorLocation = gl.getUniformLocation(program, "color");

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program,"ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program,"diffuseProduct"),flatten(diffuseProduct) );   
    gl.uniform4fv(gl.getUniformLocation(program,"specularProduct"),flatten(specularProduct) );     
    gl.uniform4fv(gl.getUniformLocation(program,"lightPosition"),flatten(lightPosition) );  

    gl.uniform1f(gl.getUniformLocation(program,"shininess"),materialShininess);
    
    

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
    document.getElementById("inp_lightposX").oninput = function (event) {
        lightPosition[0] = event.target.value;
    };
    document.getElementById("inp_lightposY").oninput = function (event) {
        lightPosition[1] = event.target.value;
    };
    document.getElementById("inp_lightposZ").oninput = function (event) {
        lightPosition[2] = event.target.value;
    };
    document.getElementById("inp_shininess").oninput = function (event) {
        shiny = event.target.value;
    };
    document.getElementById("inp_matdiffuseR").oninput = function (event) {
        mDiffuseSlider[0] = event.target.value;
    };
    document.getElementById("inp_matdiffuseG").oninput = function (event) {
        mDiffuseSlider[1] = event.target.value;
    };
    document.getElementById("inp_matdiffuseB").oninput = function (event) {
        mDiffuseSlider[2] = event.target.value;
    };
    document.getElementById("inp_matspecularR").oninput = function (event) {
        mSpecularSlider[0] = event.target.value;
    };
    document.getElementById("inp_matspecularG").oninput = function (event) {
        mSpecularSlider[1] = event.target.value;
    };
    document.getElementById("inp_matspecularB").oninput = function (event) {
        mSpecularSlider[2] = event.target.value;
    };
    document.getElementById("inp_matambientR").oninput = function (event) {
        mAmbientSlider[0] = event.target.value;
    };
    document.getElementById("inp_matambientG").oninput = function (event) {
        mAmbientSlider[1] = event.target.value;
    };
    document.getElementById("inp_matambientB").oninput = function (event) {
        mAmbientSlider[2] = event.target.value;
    };


    render();
};

function shading(){
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program,"ambientProduct"),       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program,"diffuseProduct"),       flatten(diffuseProduct) );   
    gl.uniform4fv(gl.getUniformLocation(program,"specularProduct"),        flatten(specularProduct) );     
    gl.uniform4fv(gl.getUniformLocation(program,"lightPosition"),        flatten(lightPosition) ); 
    gl.uniform1f(gl.getUniformLocation(program,"shininess"),materialShininess);

};
function render() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mvMatrix = lookAt(eye, at, up);
    var pMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, zeminBuffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    materialDiffuse = vec4(0.7, 0.7, 0.5, 1.0);
    materialSpecular = vec4(1.0,1.0,1.0,1.0);
    materialAmbient = vec4( 0.0, 0.0, 0.0, 1.0 );
    materialShininess = 5;
    shading();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    mvMatrix = mult((mult(translate(positions[0], positions[1], positions[2]), mvMatrix)), translate(0, 0, 0));
    mvMatrix = mult(mvMatrix, scalem(scale, scale, scale));
    mvMatrix = mult(mvMatrix, rotateX(theta[0]));
    mvMatrix = mult(mvMatrix, rotateY(theta[1]));
    mvMatrix = mult(mvMatrix, rotateZ(theta[2]));

    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, koniBuffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    materialDiffuse = mDiffuseSlider;
    materialSpecular = mSpecularSlider;
    materialAmbient = mAmbientSlider;
    materialShininess = shiny;
    shading();
    gl.drawArrays(gl.TRIANGLES, 0, (koni.length));

    gl.bindBuffer(gl.ARRAY_BUFFER, cubukBuffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    materialDiffuse = mDiffuseSlider;
    materialSpecular = mSpecularSlider;
    materialAmbient = mAmbientSlider;
    materialShininess = shiny;
    shading();
    gl.drawArrays(gl.TRIANGLES, 0, (cubuk.length));

    mvMatrix = mult(mvMatrix, translate(0, -0.225, 0));
    mvMatrix = mult(mvMatrix, rotateZ(rotateTheta));
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(projection, false, flatten(pMatrix));
    
    
    rotateTheta = rotateTheta + windspeed % 2.1;

    gl.bindBuffer(gl.ARRAY_BUFFER, rect1Buffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    materialDiffuse = vec4(1, 0, 0, 1.0);
    materialSpecular = mSpecularSlider;
    materialAmbient = mAmbientSlider;
    materialShininess = shiny;
    shading();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, rect2Buffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    materialDiffuse = vec4(0, 1, 0, 1.0);
    materialSpecular = mSpecularSlider;
    materialAmbient = mAmbientSlider;
    materialShininess = shiny;
    shading();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, rect3Buffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    materialDiffuse = vec4(0, 0, 1, 1.0);
    materialSpecular = mSpecularSlider;
    materialAmbient = mAmbientSlider;
    materialShininess = shiny;
    shading();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    

    gl.uniform1f(gl.getUniformLocation(program,"shininess"),materialShininess);


    window.requestAnimFrame(render);
}

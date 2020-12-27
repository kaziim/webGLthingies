"use strict";

var canvas;
var gl;
var u_colorLocation, u_Color;
var bufferTri, bufferRect, triVertices, rectVertices;
var bufferRect1, rect1Vertices, bufferRect2, rect2Vertices;
var vPosition;
var transformationMatrix, transformationMatrixLoc;
var red, green, blue, purple;
var positions = vec2(0,0);
var scale = vec2(1,1);
var theta = 0;
var rotateTheta = 0;
var turnSpeed = 1;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    

    // Make the letters
    triVertices = [
        vec2(  -0.2,  -0.5 ),
        vec2(  0.2,  -0.5 ),
        vec2(  -0.0, 0.11 )
    ];

    rectVertices = [
        vec2(  0.04,  0 ), //rb
        vec2(  -0.04,  0 ), //lb
        vec2(  0.04,  0.35 ), //rt
        vec2(  -0.04,  0.35 ) //lt
    ];
    rect1Vertices = [
        vec2(  -0.02,  0.035 ), //rb
        vec2(  0.02,  -0.035 ), //lb
        vec2(  -0.32,  -0.14 ), //rt
        vec2(  -0.28,  -0.21 ) //lt
    ];
    
    rect2Vertices = [
        vec2(  0.02,  0.035 ), //rb
        vec2(  -0.02,  -0.035 ), //lb
        vec2(  0.32,  -0.14 ), //rt
        vec2(  0.28,  -0.21 ) //lt
    ];


    // Load the data into the GPU
    bufferTri = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferTri );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triVertices), gl.STATIC_DRAW );

    // Load the data into the GPU
    bufferRect = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices), gl.STATIC_DRAW );

    bufferRect1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect1 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rect1Vertices), gl.STATIC_DRAW );
    
    bufferRect2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rect2Vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );

    u_colorLocation = gl.getUniformLocation(program, "fColor");

    document.getElementById("inp_objX").oninput = function(event) {
        positions[0] = event.target.value;
        
    };
    document.getElementById("inp_objY").oninput = function(event) {
        positions[1] = event.target.value;
        
    };
    document.getElementById("inp_obj_scale").oninput = function(event) {
        scale[0] = event.target.value;
        scale[1] = event.target.value;
        
    };
    document.getElementById("inp_obj_rotation").oninput = function(event) {
        theta = event.target.value;
        
    };
    document.getElementById("inp_wing_speed").oninput = function(event) {
        turnSpeed = event.target.value;
       
    };
    document.getElementById("redSlider").oninput = function(event) {
        red = event.target.value;
    };
    document.getElementById("greenSlider").oninput = function(event) {
        green = event.target.value;
        
    };
    document.getElementById("blueSlider").oninput = function(event) {
        blue = event.target.value;
        
    };

    render();

};


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );


    transformationMatrix = mat4();

    transformationMatrix = mult((mult(translate(positions[0],positions[1],0),transformationMatrix)),translate(0,0,0));
    transformationMatrix = mult(transformationMatrix, scalem(scale[0],scale[1],0));
    transformationMatrix = mult(transformationMatrix, rotateZ(theta));

    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferTri );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4f(u_colorLocation, red, green, blue, 1.0); 
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 3 );

    transformationMatrix = mult(transformationMatrix, rotateZ(rotateTheta));

    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    rotateTheta = rotateTheta + turnSpeed%2.3;

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4f(u_colorLocation, 1.0, 0.0, 0.0, 1.0); 
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect1 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4f(u_colorLocation, 0.0, 1.0, 0.0, 1.0); 
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect2 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4f(u_colorLocation, 0.0, 0.0, 1.0, 1.0); 
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    window.requestAnimFrame(render);
}

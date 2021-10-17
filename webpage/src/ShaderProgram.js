import * as mathjs from 'mathjs';
import { transpose } from './utilities.js'

export class ShaderProgram {
    constructor(gl, vertCode, fragCode) {
        this.vertShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        this.program = gl.createProgram();

        gl.shaderSource(this.vertShader, vertCode);
        gl.shaderSource(this.fragShader, fragCode);

        gl.compileShader(this.vertShader);
        gl.compileShader(this.fragShader);

        if (!gl.getShaderParameter(this.vertShader, gl.COMPILE_STATUS)) {
            console.log('ERROR COMPILING VERTEX SHADER')
            console.log(gl.getShaderInfoLog(this.vertShader));
        }

        if (!gl.getShaderParameter(this.fragShader, gl.COMPILE_STATUS)) {
            console.log('ERROR COMPILING FRAGMENT SHADER')
            console.log(gl.getShaderInfoLog(this.fragShader));
        }

        gl.attachShader(this.program, this.vertShader); 
        gl.attachShader(this.program, this.fragShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.log('ERROR LINKING')
            console.log(gl.getProgramInfoLog(this.program))
        }

        this.gl = gl;
        this.generateHandles();
    }

    generateHandles() {
        ['a_pos', 'a_nor', 'a_col', 'a_index'].forEach(attr => {
            this[attr] = this.gl.getAttribLocation(this.program, attr);
        });
        
        ['u_model', 'u_modelInvTr', 'u_proj', 'u_view', 'u_viewInv', 'u_player', 'u_camPos', 'u_time'].forEach(unif => {
            this[unif] = this.gl.getUniformLocation(this.program, unif);
        });
    }

    setModelMatrix(modelMatrix) {
        this.useMe();
        this.gl.uniformMatrix4fv(this.u_model, false, new Float32Array(modelMatrix.flat()));

        transpose(modelMatrix);
        let mathstuff = mathjs.inv(modelMatrix);
        this.gl.uniformMatrix4fv(this.u_modelInvTr, false, new Float32Array(mathstuff.flat()));
    }

    setProjMatrix(projMatrix) {
        this.useMe();
        this.gl.uniformMatrix4fv(this.u_proj, true, new Float32Array(projMatrix.flat()));
    }

    setViewMatrix(viewMatrix) {
        this.useMe();
        this.gl.uniformMatrix4fv(this.u_view, true, new Float32Array(viewMatrix.flat()));


        let invertedView = mathjs.inv(viewMatrix);
        this.gl.uniformMatrix4fv(this.u_viewInv, false, new Float32Array(invertedView.flat()));
    }

    setCameraPosition(p) {
        this.useMe();
        this.gl.uniform4fv(this.u_camPos, new Float32Array([p[0], p[1], p[2], 1]));
    }

    setTime(t) {
        this.useMe();
        this.gl.uniform1i(this.u_time, t);
    }

    useMe() {
        this.gl.useProgram(this.program);
    }

    draw(drawable) {
        this.useMe();

        this.gl.enableVertexAttribArray(this.a_pos);
        drawable.bindVertex();
        this.gl.vertexAttribPointer(this.a_pos, 4, this.gl.FLOAT, false, 0, 0);

        this.gl.enableVertexAttribArray(this.a_col);
        drawable.bindColor();
        this.gl.vertexAttribPointer(this.a_col, 4, this.gl.FLOAT, false, 0, 0);

        if (this.a_nor != -1 ) {
            this.gl.enableVertexAttribArray(this.a_nor);
            drawable.bindNormal();
            this.gl.vertexAttribPointer(this.a_nor, 4, this.gl.FLOAT, false, 0, 0);
        }

        drawable.bindIndex();
        this.gl.drawElements(drawable.drawMode(), drawable.indices.length, this.gl.UNSIGNED_INT, 0);
    }
}
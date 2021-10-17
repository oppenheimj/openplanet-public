import { Drawable } from './Drawable.js'

export class Triangle extends Drawable {
    constructor(myGL) {
        super(myGL);

        this.vertices = [
           [-0.5, 0.5, 0.0],
           [-0.5, -0.5, 0.0],
           [0.5, -0.5, 0.0]
         ];
             
        this.indices = [0, 1, 2]; 

        this.colors = [
            [1, 0, 0, 1],
            [0, 1, 0, 1],
            [0, 0, 1, 1]
        ];
    }

    drawMode() {
        return this.myGL.gl.TRIANGLES
    }

    create() {
        const gl = this.myGL.gl;

        this.bindIndex();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.forBuffer(this.indices, Uint16Array), gl.STATIC_DRAW);

        this.bindVertex();
        gl.bufferData(gl.ARRAY_BUFFER, this.forBuffer(this.vertices, Float32Array), gl.STATIC_DRAW);

        this.bindColor();
        gl.bufferData(gl.ARRAY_BUFFER, this.forBuffer(this.colors, Float32Array), gl.STATIC_DRAW);
    }
}
import { Drawable } from './Drawable.js'

export class Points extends Drawable {
    constructor(myGL) {
        super(myGL);

        this.vertices = [
            [-0.5, 0.5, 0.0],
            [0.0, 0.5, 0.0],
            [-0.25, 0.25, 0.0]
        ];

        this.colors = [
            [1, 0, 0, 1],
            [0, 1, 0, 1],
            [0, 0, 1, 1]
        ];
    }

    drawMode() {
        return this.myGL.gl.POINTS
    }

    create() {
        const gl = this.myGL.gl;

        this.bindVertex();
        gl.bufferData(gl.ARRAY_BUFFER, this.forBuffer(this.vertices), gl.STATIC_DRAW);

        this.bindColor();
        gl.bufferData(gl.ARRAY_BUFFER, this.forBuffer(this.colors), gl.STATIC_DRAW);
    }
}
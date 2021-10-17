import { Drawable } from './Drawable.js'

export class Axes extends Drawable {
    constructor(myGL) {
        super(myGL);

        const R = 100;

        this.vertices = [
            [0, 0, 0, 1],
            [R, 0, 0, 1],
            [0, 0, 0, 1],
            [0, R, 0, 1],
            [0, 0, 0, 1],
            [0, 0, R, 1]
         ];

        this.indices = [0, 1, 2, 3, 4, 5];

        this.colors = [
            [1, 0, 0, 1],
            [1, 0, 0, 1],
            [0, 1, 0, 1],
            [0, 1, 0, 1],
            [0, 0, 1, 1],
            [0, 0, 1, 1]
        ];

        this.modelMatrix = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]];

        this.create();
    }

    drawMode() {
        return this.myGL.gl.LINES;
    }
}
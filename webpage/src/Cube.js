import { Drawable } from './Drawable.js'

export class Cube extends Drawable {
    constructor(myGL) {
        super(myGL);
    }

    drawMode() {
        return this.myGL.gl.TRIANGLES
    }
}
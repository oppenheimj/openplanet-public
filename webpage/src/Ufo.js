import { Drawable } from './Drawable.js'

export class Ufo extends Drawable {
    constructor(myGL) {
        super(myGL);
    }

    drawMode() {
        return this.myGL.gl.TRIANGLES
    }
}
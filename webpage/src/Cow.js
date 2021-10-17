import { Drawable } from './Drawable.js'

export class Cow extends Drawable {
    constructor(myGL) {
        super(myGL);

        this.customInit = {
            f: { vectorToRotate: 'forward', axisOfRotation: 'up', radians: Math.PI/2 },
            r: { vectorToRotate: 'right',   axisOfRotation: 'up', radians: Math.PI/2 }
        }
    }

    drawMode() {
        return this.myGL.gl.TRIANGLES
    }
}
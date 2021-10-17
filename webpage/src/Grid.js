import { Drawable } from './Drawable.js'

export class Grid extends Drawable {
    constructor(myGL) {
        super(myGL);

        this.distance = 20000;
        this.density = 100;
        this.n = Math.floor(this.distance/this.density);
        this.vertices = [];
        this.createPlane(0, 2, 0);

        this.indices = Array.from(Array(this.vertices.length).keys());
        this.colors = Array(this.vertices.length).fill([0, 0, 0, 1]);

        this.modelMatrix = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        this.create();
    }

    drawMode() {
        return this.myGL.gl.LINES;
    }

    createPlanes(d1, d2) {
        for (let i = 0; i < this.n; i++) {
            this.createPlane(d1, d2, i * this.density);

            if (i !== 0) {
                this.createPlane(d1, d2, -i * this.density);
            }
        }
    }

    createPlane(d1, d2, x) {
        // d1 and d2 are in 0, 1, or 2, representing
        // x y and z

        for (let i = 0; i < this.n; i++) {
            let v;

            [1, -1].forEach(a =>
                [1, -1].forEach(b => {
                    v = [x, x, x, 1];
                    v[d1] = b * this.distance;
                    v[d2] = a * (i * this.density);
                    this.vertices.push(v);
                })
            );

            [1, -1].forEach(a => [1, -1].forEach(b => {
                v = [x, x, x, 1];
                v[d1] = a * (i * this.density);
                v[d2] = b * this.distance;
                this.vertices.push(v);
            }));
        }
    }
}
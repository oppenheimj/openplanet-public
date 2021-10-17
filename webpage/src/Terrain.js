import { Drawable } from './Drawable.js'

export class Terrain extends Drawable {
    constructor(myGL, terrainManager, x, z, ys) {
        super(myGL);
        this.terrainManager = terrainManager

        this.dim = terrainManager.dim;
        this.res = terrainManager.res;
        this.x = x;
        this.z = z;
        this.ys = ys;

        this.modelMatrix = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    init(workerURL) {
        const worker = new Worker(workerURL)

        const n = Math.floor(this.dim / this.res);

        var verticesFloat32View = new Float32Array((n) * (n) * 6 * 4);
        var colorsFloat32View = new Float32Array((n) * (n) * 6 * 4);
        var indicesUint32View = new Uint32Array((n) * (n) * 6);
        var normalsFloat32View = new Float32Array((n) * (n) * 6 * 4);

        worker.postMessage(
            {
                dim: this.dim,
                res: this.res,
                terrainX: this.x,
                terrainZ: this.z,
                ys: this.ys,
                v: verticesFloat32View.buffer,
                c: colorsFloat32View.buffer,
                i: indicesUint32View.buffer,
                n: normalsFloat32View.buffer
            },
            [
                verticesFloat32View.buffer,
                colorsFloat32View.buffer,
                indicesUint32View.buffer,
                normalsFloat32View.buffer
            ]
        );

        worker.addEventListener('message', e => {
            this.vertices = new Float32Array(e.data.v);
            this.colors = new Float32Array(e.data.c);
            this.indices = new Uint32Array(e.data.i);
            this.normals = new Float32Array(e.data.n);

            // this.myGL.addTerrain(this);
            this.terrainManager.addTerrain(this)
        })
    }

    drawMode() {
        return this.myGL.gl.TRIANGLES
    }
}
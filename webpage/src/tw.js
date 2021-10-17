self.addEventListener('message', function(e) {
    const { dim, res, terrainX, terrainZ, ys } = e.data;
    const n = Math.floor(dim / res);

    var verticesFloat32View = new Float32Array(e.data.v);
    var colorsFloat32View = new Float32Array(e.data.c);
    var indicesUint32View = new Uint32Array(e.data.i);
    var normalsFloat32View = new Float32Array(e.data.n);

    let v_i = 0;
    let c_i = 0;
    let i_i = 0;
    let n_i = 0;

    let i;
    let j;

    for (let x = 0; x < n; x++) {
        for (let z = 0; z < n; z++) {
            let vertices = [
                [terrainX + x * res,        ys[(n+1) * x + z],          terrainZ + z * res,          1],
                [terrainX + (x + 1) * res,  ys[(n+1) * (x+1) + z],      terrainZ + z * res,          1],
                [terrainX + (x + 1) * res,  ys[(n+1) * (x+1) + (z+1)],  terrainZ + (z + 1) * res,    1],
                [terrainX + x * res,        ys[(n+1) * x + z],          terrainZ + z * res,          1],
                [terrainX + (x + 1) * res,  ys[(n+1) * (x+1) + (z+1)],  terrainZ + (z + 1) * res,    1],
                [terrainX + x * res,        ys[(n+1) * x + (z+1)],      terrainZ + (z + 1) * res,    1]
            ];

            const normal1 = computeNormal(vertices[0], vertices[1], vertices[2]);
            const normal2 = computeNormal(vertices[3], vertices[4], vertices[5]);

            for (j = 0; j < 3; j++) {
                for (i = 0; i < 4; i++) {
                    normalsFloat32View[n_i++] = normal1[i];
                    colorsFloat32View[c_i++] = i == 3 ? 1 : normal1[i];
                }
            }

            for (j = 0; j < 3; j++) {
                for (i = 0; i < 4; i++) {
                    normalsFloat32View[n_i++] = normal2[i];
                    colorsFloat32View[c_i++] = i == 3 ? 1 : normal2[i];
                }
            }

            vertices.flat().forEach(e => {
                verticesFloat32View[v_i++] = e;
            });
        }
    }

    Array.from(Array(n * n * 6).keys()).forEach(e => {
        indicesUint32View[i_i++] = e;
    })

    self.postMessage({
        v: verticesFloat32View.buffer,
        c: colorsFloat32View.buffer,
        i: indicesUint32View.buffer,
        n: normalsFloat32View.buffer
    }, [
        verticesFloat32View.buffer,
        colorsFloat32View.buffer,
        indicesUint32View.buffer,
        normalsFloat32View.buffer
    ]);

    self.close();
});

class Vec4 {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    minus(vec4) {
        return new Vec4(this.x - vec4.x, this.y - vec4.y, this.z - vec4.z, 1);
    }
}

function computeNormal(v2, v3, v1) {
    const p1 = new Vec4(...v1);
    const p2 = new Vec4(...v2);
    const p3 = new Vec4(...v3);

    let v = p2.minus(p1);
    let w = p3.minus(p1);

    let x = v.y * w.z - v.z * w.y;
    let y = v.z * w.x - v.x * w.z;
    let z = v.x * w.y - v.y * w.x;
    let s = Math.sqrt(x * x + y * y + z * z);
    // let s = x + y + z

    return [- x / s, - y / s,  -z / s, 0];
}

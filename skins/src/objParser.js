var fs = require('fs')

function parseLine(line, lastVal) {
    const splitLine = line.split(' ');
    splitLine.shift();

    const x = splitLine.map(e => parseFloat(e));
    x.push(lastVal);

    return x;
}

const faceTriplet = t => {
    const vals = t.split('/').map(e => parseInt(e, 10))
    return { v: vals[0], n: vals[2] }
}

function parseObjFile(fileName) {
    var filename = `./skins/${fileName}.obj`;

    var rawVertices = [];
    var rawNormals = [];
    
    var vertices = [];
    var normals = [];
    var indices = [];
    var colors = [];
    
    const f = fs.readFileSync(filename, 'utf8');
    const lines = f.split('\n');
    
    var idxPtr = 0;
    
    lines.forEach(
        line => {        
            if (line.includes('v ')) {
                rawVertices.push(parseLine(line, 1));
            }
            if (line.includes('vn ')) {
                rawNormals.push(parseLine(line, 0));
            }
            if (line.includes('f ')) {
                const splitLine = line.split(' ');
                splitLine.shift();
    
                // var color = Math.random() < 0.35 ? [0, 0, 0, 1] : [1, 1, 1, 1];
                var color = [1, 0, 0.83, 1];
                splitLine.forEach(v => {
                    const t = faceTriplet(v);
                    vertices.push(rawVertices[t.v - 1]);
                    normals.push(rawNormals[t.n - 1]);
                    colors.push(color);
                });
    
                var ptr = 1;
                while (ptr != splitLine.length - 1) {
                    indices.push(idxPtr);
                    indices.push(idxPtr + ptr);
                    indices.push(idxPtr + ptr + 1);
    
                    ptr++;
                }
                idxPtr += splitLine.length;
            }
        }
    )

    return { vertices, normals, indices, colors };
}

Object.assign(module.exports, { parseObjFile });

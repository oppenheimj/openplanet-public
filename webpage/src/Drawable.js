export class Drawable {
    constructor(myGL) {
        this.myGL = myGL;
    }

    configureUsingServerData(serverResponse) {
        // Server response should contain
        // vertices, normals, indices, maybe colors
        Object.assign(this, serverResponse);
    }

    forBuffer(arr, dataType) {
        return new dataType(arr.flat());
    }

    genBuffers() {
        const gl = this.myGL.gl;

        this.vertexBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.normalBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
    }

    bindIndex() {
        const gl = this.myGL.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    bindVertex() {
        const gl = this.myGL.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    }

    bindColor() {
        const gl = this.myGL.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    }

    bindNormal() {
        const gl = this.myGL.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    }

    create(isTerrain) {
        this.genBuffers();

        const gl = this.myGL.gl;

        this.bindIndex();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, isTerrain ? this.indices : this.forBuffer(this.indices, Uint32Array), gl.STATIC_DRAW);

        this.bindVertex();
        gl.bufferData(gl.ARRAY_BUFFER, isTerrain ? this.vertices : this.forBuffer(this.vertices, Float32Array), gl.STATIC_DRAW);

        this.bindColor();
        gl.bufferData(gl.ARRAY_BUFFER, isTerrain ? this.colors : this.forBuffer(this.colors, Float32Array), gl.STATIC_DRAW);

        if (this.normals) {
            // Axes is a subclass that doesn't have normals
            // because it is drawn with a flat shader
            this.bindNormal();
            gl.bufferData(gl.ARRAY_BUFFER, isTerrain ? this.normals : this.forBuffer(this.normals, Float32Array), gl.STATIC_DRAW);
        }
    }

    delete() {
        const gl = this.myGL.gl;

        gl.deleteBuffer(this.indexBuffer)
        gl.deleteBuffer(this.vertexBuffer)
        gl.deleteBuffer(this.colorBuffer)
        gl.deleteBuffer(this.normalBuffer)
    }
}
import { ShaderProgram } from './ShaderProgram.js';
import { Camera } from './Camera.js';
import { Grid } from './Grid.js';
import { Axes } from './Axes.js';
import { TerrainManager } from './TerrainManager.js'
import { Ui } from './Ui.js'
import { flatVertCode, flatFragCode, lambertVertCode, lambertFragCode } from './shaders.js'

export class MyGL {
    constructor(glContext, width, height, loader) {
        this.loader = loader;

        this.terrains = {};
        this.terrainManager = new TerrainManager(this);

        this.camera = new Camera(70, 1, 5000);
        this.camera.setWidthHeight(width, height);
        this.projMatrix = this.camera.getProjectionMatrix();

        this.width = width;
        this.height = height;

        this.gl = glContext;
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.FRONT);

        this.shaderPrograms = {};
        this.initShaderProgram('flat', flatVertCode, flatFragCode);
        this.initShaderProgram('lambert', lambertVertCode, lambertFragCode);

        this.otherPlayers = {};

        this.geometry = [];
        this.addGeometry(new Axes(this));
        this.addGeometry(new Grid(this));
    }

    initUi(positionNode, lookNode) {
        this.ui = new Ui(this.player, positionNode, lookNode)
    }

    initShaderProgram(name, vertCode, fragCode) {
        this.shaderPrograms[name] = new ShaderProgram(this.gl, vertCode, fragCode);
    }

    paintGL(t) {
        this.ui.update()

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        const viewMatrix = this.player.getViewMatrix();

        this.terrains = this.terrainManager.resetTerrains(this.terrains, this.player)

        this.shaderPrograms['flat'].setViewMatrix(viewMatrix);
        this.shaderPrograms['flat'].setProjMatrix(this.projMatrix);

        this.shaderPrograms['lambert'].setViewMatrix(viewMatrix);
        this.shaderPrograms['lambert'].setProjMatrix(this.projMatrix);
        this.shaderPrograms['lambert'].setCameraPosition(this.player.position);
        this.shaderPrograms['lambert'].setTime(t);

        Object.values(this.terrains).forEach(t => {
            this.shaderPrograms['lambert'].setModelMatrix(t.modelMatrix);
            this.shaderPrograms['lambert'].draw(t);
        })

        this.geometry.forEach(g => {
            this.shaderPrograms['flat'].setModelMatrix(g.modelMatrix);
            this.shaderPrograms['flat'].draw(g);
        })

        Object.values(this.otherPlayers).forEach(otherPlayer => {
            this.shaderPrograms['lambert'].setModelMatrix(otherPlayer.getModelMatrix());
            this.shaderPrograms['lambert'].draw(otherPlayer.geometry);
        })
    }
    
    hideLoader(n) {
        if (n == 49) {
            this.loader.classList.add("hide-loader")
        }
    }

    addGeometry(g) {
        this.geometry.push(g);
    }

    addOtherPlayer(p) {
        this.otherPlayers[p.id] = p;
    }

    updateOtherPlayer(id, position, right, up, forward) {
        Object.assign(this.otherPlayers[id], { position, right, up, forward });
    }

    deleteOtherPlayer(id) {
        delete this.otherPlayers[id];
    }
}

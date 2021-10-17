import { Terrain } from "./Terrain";

export class TerrainManager {
    constructor(myGL) {
        this.myGL = myGL;
        this.workerURL = new URL("./tw.js", import.meta.url);
        this.terrains = {};

        this.dim = 400
        this.res = 2.0
        this.nRender = 2
    }

    generateTerrain(payload) {
        const { x, z, ys } = payload

        const terrain = new Terrain(this.myGL, this, x, z, ys)
        terrain.init(this.workerURL);
    }

    addTerrain(terrain) {
        const coords2Key = (x, z) => `${x},${z}`;
        const coord = coords2Key(terrain.x, terrain.z);
        this.terrains[coord] = terrain;

        console.log('Downloaded terrain at', coord);
        this.myGL.hideLoader(Object.keys(this.terrains).length);
    }

    getTerrainsAround(x, z) {
        let coord2Terrain = {}

        const coords2Key = (x, z) => `${x},${z}`;
        x = Math.floor(x / this.dim) * this.dim;
        z = Math.floor(z / this.dim) * this.dim;

        for (let i = x - this.nRender * this.dim; i <= x + this.nRender * this.dim; i+=this.dim) {
            for (let j = z - this.nRender * this.dim; j <= z + this.nRender * this.dim; j+=this.dim) {
                const key = coords2Key(i, j);

                if (key in this.terrains) {
                    coord2Terrain[key] = this.terrains[key]
                }
            }
        }

        return coord2Terrain;
    }

    resetTerrains(terrains, player) {
        const correctTerrains = this.getTerrainsAround(player.position[0], player.position[2])

        // delete old terrains
        Object.entries(terrains).forEach(([coord, terrain]) => {
            if (!(coord in correctTerrains)) {
                console.log('Unrendering terrain at', coord)
                terrain.delete()
            }
        })

        // create new terrains
        Object.entries(correctTerrains).forEach(([coord, terrain]) => {
            if (!(coord in terrains)) {
                console.log('Rendering terrain at', coord)
                terrain.create(true)
            }
        })

        return correctTerrains;
    }
}

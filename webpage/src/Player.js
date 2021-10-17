import { Entity } from './Entity.js';

export class Player extends Entity {
    constructor(id, position, right, up, forward) {
        super(position, right, up, forward);
        this.id = id;
    }

    setGeometry(geometry) {
        geometry.create();
        this.geometry = geometry;
    }
}

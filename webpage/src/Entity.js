import { sum, mult, toRadians, aRotate, multiply } from './utilities.js';

export class Entity {
    constructor(position, right, up, forward) {
        this.position = position;
        this.right = right;
        this.up = up;
        this.forward = forward;
    }

    vec2String(vec) {
        return `(${vec[0].toFixed(3)}, ${vec[1].toFixed(3)}, ${vec[2].toFixed(3)})`;
    }

    positionToString() {
        return this.vec2String(this.position);
    }

    lookToString() {
        return this.vec2String(this.forward);
    }

    rotationMatrix() {
        let f = this.forward;
        let r = this.right;
        let u = this.up;

        return [
            [r[0],  r[1],   r[2],   0],
            [u[0],  u[1],   u[2],   0],
            [f[0],  f[1],   f[2],   0],
            [0,     0,      0,      1]
        ];
    }

    translationMatrix() {
        let p = this.position;

        return [
            [1, 0,  0,  -p[0]],
            [0, 1,  0,  -p[1]],
            [0, 0,  1,  -p[2]], 
            [0, 0,  0,  1]
        ];
    }

    getModelMatrix() {
        const customRotation = (d) => aRotate(
            this[d.vectorToRotate],
            this[d.axisOfRotation],
            d.radians
        );

        const c = this.geometry.customInit;

        let f = c && c.f ? customRotation(c.f) : this.forward;
        let r = c && c.r ? customRotation(c.r) : this.right;
        let u = c && c.u ? customRotation(c.u) : this.up;

        let p = this.position;

        return [
            [r[0],  r[1],   r[2],   0],
            [u[0],  u[1],   u[2],   0],
            [f[0],  f[1],   f[2],   0],
            [p[0],  p[1],   p[2],   1]
        ];
    }

    getViewMatrix() {
        return multiply(this.rotationMatrix(), this.translationMatrix());
    }

    moveAlongVector(dir) {
        this.position = sum(this.position, dir);
    }
    
    moveForwardLocal(amt) {
        this.position = sum(this.position, mult(this.forward, amt));
    }

    moveRightLocal(amt) {
        this.position = sum(this.position, mult(this.right, amt));
    }

    moveUpLocal(amt) {
        this.position = sum(this.position, mult(this.up, amt));
    }

    moveForwardGlobal(amt) {
        this.position = sum(this.position, [0, 0, amt]);
    }

    moveRightGlobal(amt) {
        this.position = sum(this.position, [amt, 0, 0]);
    }

    moveUpGlobal(amt) {
        this.position = sum(this.position, [0, amt, 0])
    }

    rotateOnForwardLocal(deg) {
        let rad = toRadians(deg);
    
        this.right = aRotate(this.right, this.forward, rad);
        this.up = aRotate(this.up, this.forward, rad);
    }

    rotateOnRightLocal(deg) {
        let rad = toRadians(deg);
    
        this.forward = aRotate(this.forward, this.right, rad);
        this.up = aRotate(this.up, this.right, rad);
    }

    rotateOnUpLocal(deg) {
        let rad = toRadians(deg);
    
        this.forward = aRotate(this.forward, this.up, rad);
        this.right = aRotate(this.right, this.up, rad);
    }

    rotateOnForwardGlobal(deg) {
        let rad = toRadians(deg);
    
        this.forward = aRotate(this.forward, [0, 0, 1], rad);
        this.right = aRotate(this.right, [0, 0, 1], rad);
        this.up = aRotate(this.up, [0, 0, 1], rad);
    }

    rotateOnRightGlobal(deg) {
        let rad = toRadians(deg);
    
        this.forward = aRotate(this.forward, [1, 0, 0], rad);
        this.right = aRotate(this.right, [1, 0, 0], rad);
        this.up = aRotate(this.up, [1, 0, 0], rad);
    }

    rotateOnUpGlobal(deg) {
        let rad = toRadians(deg);
    
        this.forward = aRotate(this.forward, [0, 1, 0], rad);
        this.right = aRotate(this.right, [0, 1, 0], rad);
        this.up = aRotate(this.up, [0, 1, 0], rad);
    }
}
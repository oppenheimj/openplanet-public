export class Ui {
    constructor(player, positionNode, lookNode) {
        this.player = player
        this.positionNode = positionNode;
        this.lookNode = lookNode;
    }

    update() {
        this.positionNode.nodeValue = this.player.positionToString();
        this.lookNode.nodeValue = this.player.lookToString();
    }
}
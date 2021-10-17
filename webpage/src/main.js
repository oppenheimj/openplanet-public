import { MyGL } from './MyGL.js'
import { Player } from './Player.js'
import { Cow } from './Cow.js';
import { Cube } from './Cube.js';
import { Ufo } from './Ufo.js';

var canvas = document.getElementById('glCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gl = canvas.getContext('webgl2');
const loader = document.getElementById('loader');

// look up the elements we want to affect
var positionElement = document.querySelector("#position");
var lookElement = document.querySelector("#look");
    
// Create text nodes to save some time for the browser
// and avoid allocations.
var positionNode = document.createTextNode("");
var lookNode = document.createTextNode("");

// Add those text nodes where they need to go
positionElement.appendChild(positionNode);
lookElement.appendChild(lookNode);

let player;
let myGL = new MyGL(gl, canvas.width, canvas.height, loader);
let ws;
let then = 0;

function asyncRequest(skinName, Clazz) {
	return new Promise(function(resolve, reject) {
		let xhttp = new XMLHttpRequest();

		xhttp.onload = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
                    const serverResponse = JSON.parse(xhttp.responseText);

                    const skin = new Clazz(myGL);
                    skin.configureUsingServerData(serverResponse);
                    myGL[skinName] = skin;

                    console.log('Loaded skin', skinName)
					resolve();
                } else {
                    reject('Call failed');
                }
            }
		};

        xhttp.onerror = function (e) {
            console.error(xhttp.statusText);
        };

		xhttp.open('GET', `${process.env.skinServer}/${skinName}`, true);
		xhttp.send();
	});
}

function loadSkins() {
    const skins = [
        { name: 'cow', Clazz: Cow },
        { name: 'cube', Clazz: Cube },
        { name: 'ufo', Clazz: Ufo }
    ];

    return Promise.all(
        skins.map(({name, Clazz}) => asyncRequest(name, Clazz))
    )
}

function loadWebsocket() {
    ws = new WebSocket(process.env.webSocketServer);

    return new Promise(function(resolve, reject) {
        ws.onopen = function() {
            console.log("Websocket connection now open")
        };

        ws.onmessage = function(msg) {
            const message = JSON.parse(msg.data);

            if (message.messageType == "INIT") {
                const { id, position, right, up, forward } = message.data.player;
        
                player = new Player(id, position, right, up, forward);
                myGL.player = player;
                myGL.initUi(positionNode, lookNode);

                ws.send(JSON.stringify(player));
                resolve();
            }
        
            if (message.messageType == "UPDATE") {
                const { id, position, right, up, forward } = message.data
        
                if (!Object.keys(myGL.otherPlayers).includes(id)) {
        
                    const otherPlayer = new Player(id, position, right, up, forward);
                    otherPlayer.setGeometry(myGL.ufo);
                    myGL.addOtherPlayer(otherPlayer);
                } else {
                    myGL.updateOtherPlayer(id, position, right, up, forward);
                }
            }
        
            if (message.messageType == "DISCONNECT") {
                const { id } = message.data;
        
                myGL.deleteOtherPlayer(id);
            }
        
            if (message.messageType == "TERRAIN") {
                myGL.terrainManager.generateTerrain(message.data);
            }
        };        
    });
};

function enableControls() {
    // MOUSE CONTROLS
    canvas.requestPointerLock = canvas.requestPointerLock ||
                                canvas.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock ||
                            document.mozExitPointerLock;

    canvas.onclick = function() {
        canvas.requestPointerLock();
    };

    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

    function lockChangeAlert() {
        if (document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas) {
            console.log('The pointer lock status is now locked');
            document.addEventListener("mousemove", updatePosition, false);
        } else {
            console.log('The pointer lock status is now unlocked');  
            document.removeEventListener("mousemove", updatePosition, false);
        }
    }
    
    function updatePosition(e) {
        let dX = -e.movementX;
        let dY = -e.movementY;
    
        const SENSITIVITY = 80.0;
    
        if (dX != 0) {
            player.rotateOnUpGlobal(dX/canvas.width * SENSITIVITY);
        }
    
        if (dY != 0) {
            player.rotateOnRightLocal(dY/canvas.height * SENSITIVITY);
        }
    
        if (dX != 0 || dY != 0) {
            ws.send(JSON.stringify(player));
        }
    }

    // KEYBOARD CONTROLS
    function handleKeyDown(event) {
        keyState.add(event.key);
    }

    function handleKeyUp(event) {
        keyState.delete(event.key);
    }

    document.addEventListener('keydown', handleKeyDown, false);
    document.addEventListener('keyup', handleKeyUp, false);
}

var t = 0;
function gameLoop(now) {
    now *= 0.001; // Convert to seconds
    var deltaTime = now - then;
    then = now;

    let updated = false;
    let m = 0.4;

    if (keyState.has('w')) {
        player.moveForwardLocal(m);
        updated = true;
    }

    if (keyState.has('s')) {
        player.moveForwardLocal(-m);
        updated = true;
    }

    if (keyState.has('a')) {
        player.moveRightLocal(-m);
        updated = true;
    }

    if (keyState.has('d')) {
        player.moveRightLocal(m);
        updated = true;
    }

    if (keyState.has('e')) {
        player.moveUpLocal(m);
        updated = true;
    }

    if (keyState.has('q')) {
        player.moveUpLocal(-m);
        updated = true;
    }

    if (updated) {
        ws.send(JSON.stringify(player));
    }

    myGL.paintGL(t);

    t++;
    requestAnimationFrame(gameLoop);
}

var keyState = new Set();

function initialize() {
    return loadSkins().then(
        () => loadWebsocket()
    ).then(
        () => enableControls()
    ).then(
        () => requestAnimationFrame(gameLoop)
    ).catch(function(reason) {
        console.log(reason);
    });
}

initialize();
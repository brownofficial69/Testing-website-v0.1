importScripts('engine.js');
onmessage = e => postMessage(think(e.data.fen, e.data.level));

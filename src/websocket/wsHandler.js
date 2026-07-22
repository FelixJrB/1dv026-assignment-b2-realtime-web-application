import { WebSocketServer } from 'ws'
/**
 * WebSocket handler module for managing client connections and webhook messages from GitLab.
 *
 * @file WebSocket handler.
 * @description Manages WebSocket connections and handles webhook messages from GitLab.
 * @param {import('http').Server} server - The HTTP server instance to attach the WebSocket server to.
 * @module websocket/wsHandler
 * @author Felix Berglund
 * @see link:
 * https://websockets.spec.whatwg.org/#the-websocket-interface
 * https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 */
export function webSocketConnection (server) {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (websocket) => {
    console.log('Client connected via WebSocket')
    websocket.send('Welcome to the WebSocket server!')
  })
}

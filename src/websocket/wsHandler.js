import { WebSocketServer, WebSocket } from 'ws'

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
export class WebSocketHandler {
  // Single WebSocket server instance, shared across the class methods.
  #wss
  
  /**
   * Initializes the WebSocket server and sets up connection handling.
   * 
   * @param {object} server - The HTTP server instance to attach the WebSocket server to.
   */
  webSocketConnection (server) {
    this.#wss = new WebSocketServer({ server })

    this.#wss.on('connection', (websocket) => {
      console.log('Client connected via WebSocket')
      websocket.send('Welcome to the WebSocket server!')
    })
  }

  /**
   * Broadcasts a message to all connected WebSocket clients.
   * 
   * @param {*} payload - The message payload to broadcast.
   */
  broadcast (payload) {
    const message = JSON.stringify(payload)
    for (const client of this.#wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    }
  }
}

export const wsHandler = new WebSocketHandler()
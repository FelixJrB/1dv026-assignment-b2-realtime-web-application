import { app } from './app.js'
import dotenv from 'dotenv'
import { wsHandler } from './websocket/wsHandler.js'

/**
 * @file Entry point for the application.
 * @module server
 * @author Felix Berglund
 * @description Starts the HTTP server and imports the configured Express application.
 * @see link:
 * https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 * https://websockets.spec.whatwg.org/#the-websocket-interface
 */

dotenv.config({ quiet: true })

const port = 3001

const server = app.listen(port, () => {
  console.log(`Server on http://localhost:${port}`)
})

// Initialize WebSocket connections by calling the webSocketConnection function
// from the wsHandler module and passing the server instance
wsHandler.webSocketConnection(server)

/**
 * @file Client-side WebSocket handler.
 * @author Felix Berglund
 * @description Connects to WebSocket server and updates DOM in real-time.
 * @see link:
 * https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 * https://websockets.spec.whatwg.org/#the-websocket-interface
 */

// Create a new WebSocket connection to the server
const socket = new WebSocket(`ws://${window.location.host}`)

// Connection opened
socket.addEventListener('open', () => {
  console.log('Successfully connected to WebSocket server')
  socket.send('Hello from the Server!')
})

// Listen for messages from the WebSocket server
socket.addEventListener('message', (event) => {
  console.log('Message received from WebSocket server:', event.data)
})

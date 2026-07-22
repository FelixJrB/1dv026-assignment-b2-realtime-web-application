import dotenv from 'dotenv'
import express from 'express'
import { join } from 'node:path'
import { getIssues } from './services/gitlabService.js'
import { webSocketConnection } from './websocket/wsHandler.js'

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

const viewsPath = join(import.meta.dirname, 'views')
const port = 3001
const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.get('/', async (req, res) => {
  res.render('home/index', { title: 'HomePage' }) // Render the 'home/index' view with a title
})

app.get('/issues', async (req, res) => {
  const issues = await getIssues() // Fetch issues from the GitLab API using the getIssues function from the gitlabService module
  res.render('issues/index', { issues }) // Render the 'issues/index' view and pass the fetched issues as data to the template
})

const server = app.listen(port, () => {
  console.log(`Server on http://localhost:${port}`)
})

// Initialize WebSocket connections by calling the webSocketConnection function
// from the wsHandler module and passing the server instance
webSocketConnection(server)

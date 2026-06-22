import dotenv from 'dotenv'
import express from 'express'
import { join } from 'node:path'

/**
 * @file Entry point for the application.
 * @module server
 * @author Felix Berglund
 * @description Starts the HTTP server and imports the configured Express application.
 */

dotenv.config({ quiet: true })

const viewsPath = join(import.meta.dirname, 'views')
const port = 3001
const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.get('/', async (req, res) => {
  const response = await fetch(
    `https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues`,
    { headers: { 'PRIVATE-TOKEN': process.env.GITLAB_TOKEN } }
  )
  const issues = await response.json()
  res.render('issues/index', { issues }) // Render the 'issues/index' view and pass the fetched issues as data to the template
})

app.listen(port, () => {
  console.log(`Server on http://localhost:${port}`)
})

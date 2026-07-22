import express from 'express'
import { join } from 'node:path'
import { getIssues } from './services/gitlabService.js'

/**
 * @file Configures the Express application.
 * @module app
 * @author Felix Berglund
 * @description Sets up Express middleware, routes, and exports the configured app instance.
 */

const viewsPath = join(import.meta.dirname, 'views')
export const app = express()

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

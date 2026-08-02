import { getIssues } from '../services/gitlabService.js'
import { wsHandler } from '../websocket/wsHandler.js'

/**
 * @file Issue controller.
 * @module controllers/issuesController
 * @author Felix Berglund
 * @description Handles HTTP requests for issue-related operations.
 * Receives requests from routes, calls service functions, and sends responses.
 */
class IssuesController {
  /**
   * Renders the home page.
   * 
   * @param {object} _req  - The Express request object.
   * @param {object} res The Express response object.
   */
  home (_req, res) {
    res.render('home/index', { title: 'HomePage' }) // Render the 'home/index' view with a title
  }
  
  /**
   *  Fetches issues from the GitLab API and renders the issues page.
   *  
   * @param {object} _req  - The Express request object.
   * @param {object} res The Express response object.
   */
  async showIssues (_req, res) {
    const issues = await getIssues() // Fetch issues from the GitLab API using the getIssues function from the gitlabService module
    res.render('issues/index', { issues }) // Render the 'issues/index' view and pass the fetched issues as data to the template
  }
  
  /**
   *  Recieves a Gitlab webhook and braodcasts the issue to all connected WebSocket clients using 
   * the broadcast method from the wsHandler module.
   * 
   * @param {object} req  - The Express request object.
   * @param {object} res The Express response object.
   */
  async webhook (req, res) {
    const issue = req.body.object_attributes
    console.log('Webhook successfully received', req.body)
    wsHandler.broadcast(issue) // Broadcast the received webhook messages to all connected WebSocket clients using the broadcast method from the wsHandler module
    res.sendStatus(200) // 200 Ok if response from webhook is successful
  }
}
export const issuesController = new IssuesController()
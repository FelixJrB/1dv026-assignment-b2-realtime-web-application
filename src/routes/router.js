import express from 'express'
import { issuesController } from '../controllers/issuesController.js'

/**
 * @file Application routes.
 * @module routes/router
 * @author Felix Berglund
 * @description Defines HTTP endpoints and maps them to controller functions.
 */

export const router = express.Router()

router.get('/', (req, res) => issuesController.home(req, res))
router.get('/issues', (req, res) => issuesController.showIssues(req, res))
router.post('/webhook', (req, res) => issuesController.webhook(req, res))
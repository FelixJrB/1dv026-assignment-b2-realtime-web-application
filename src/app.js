import express from 'express'
import { join } from 'node:path'
import { router } from './routes/router.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import helmet from 'helmet'
import morgan from 'morgan'
/**
 * @file Configures the Express application.
 * @module app
 * @author Felix Berglund
 * @description Sets up Express middleware, routes, and exports the configured app instance.
 */

const viewsPath = join(import.meta.dirname, 'views')
export const app = express()

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'img-src': ["'self'", 'https://gitlab.lnu.se'],
    },
  },
}))
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.use('/', router)
app.use(notFound)
app.use(errorHandler)
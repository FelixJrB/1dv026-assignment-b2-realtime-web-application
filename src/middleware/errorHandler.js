
/**
 * Handles 404 errors for not found resources.
 * 
 *link: https://expressjs.com/en/guide/error-handling.html
 *
 * @file Error handler middleware.
 * @module middleware/errorHandler
 * @author Felix Berglund
 * @description Middleware for handling 404 errors in the Express application.
 * @see link:
 * https://expressjs.com/en/guide/error-handling.html
 * @param {*} _req - The Express request object representing the incoming HTTP request.
 * @param {*} _res - The Express response object used to send the HTTP response.
 * @param {*} next - The next middleware function in the Express application.
 */
export function notFound (_req, _res, next) {
  const error = new Error('The requested resource was not found')
  error.status = 404
  next(error)
}

/**
 * Handles error responses for the Express application.
 * 
 * @param {*} err - The error object representing the error that occurred.
 * @param {*} _req - The Express request object representing the incoming HTTP request.
 * @param {*} res - The Express response object used to send the HTTP response.
 * @param {*} _next - The next middleware function in the Express application.
 */
export function errorHandler (err, _req, res, _next) {
  const status = err.status || 500
  res.status(status).send({ error: { message: err.message, status } })
}
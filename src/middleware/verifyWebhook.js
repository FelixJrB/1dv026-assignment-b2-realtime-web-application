/**
 * Verify the Gitlab webhook secret token.
 * 
 * @file Middleware for verifying the Gitlab webhook secret token.
 * @module middleware/verifyWebhook
 * @author Felix Berglund
 * @description Middleware for verifying the Gitlab webhook secret token.
 * @param {*} req - The Express request object representing the incoming HTTP request.
 * @param {*} _res - The Express response object used to send the HTTP response.
 * @param {*} next - The next middleware function in the Express application.
 * @returns {void} 
 */
export function verifyWebhook (req, _res, next) {
  const webhookSecret = process.env.WEBHOOK_SECRET
  const recievedToken = req.header('X-Gitlab-Token')

  if (recievedToken !== webhookSecret) {
    const error = new Error('Unauthorized')
    error.status = 401
    return next(error)
  }
  return next()
}

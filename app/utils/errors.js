const logger = require('../logger')

class HttpResponseError extends Error {
  constructor({ code = 500, message, service }) {
    super(message)
    this.code = code
    this.message = message
    this.service = service
  }
}

class BadRequestError extends HttpResponseError {
  constructor({ message, service }) {
    super({ code: 400, message, service })
  }
}

const handleErrors = (err, req, res, next) => {
  if (err instanceof HttpResponseError) {
    logger.warn(`Error in ${err.service} service: ${err.message}`)
    res.status(err.code).send(err.message)
  }
  // openapi validation
  else if (err.errors) {
    res.status(err.status).send(err.errors)
  }
  // multer errors
  else if (err.code) {
    res.status(400).send(err.message)
  } else if (err.status) {
    res.status(err.status).send({ error: err.status === 401 ? 'Unauthorised' : err.message })
  } else {
    logger.error('Fallback Error %j', err.stack)
    res.status(500).send('Fatal error!')
  }

  next()
}

module.exports = {
  handleErrors,
  BadRequestError,
  HttpResponseError,
}
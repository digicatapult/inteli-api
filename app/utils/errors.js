const logger = require('../logger')

class CustomError extends Error {
  constructor({ code, message, service }) {
    super(message)
    this.code = code
    this.message = message
    this.service = service
  }
}

const errorResponse = (res, err) => {
  logger.warn(`Error in ${err.service} service: ${err.message}`)

  switch (err.constructor) {
    case CustomError:
      res.status(err.code).send(err.message)
      break
    default:
      res.status(500).send(err.message)
  }
}

const handleErrors = (err, req, res, next) => {
  if (err instanceof CustomError) {
    errorResponse(res, err)
  } else if (err.errors) {
    // openapi validation
    res.status(err.status).send(err.errors)
  } else if (err.code) {
    // multer errors
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
  CustomError,
}

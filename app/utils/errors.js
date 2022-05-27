const logger = require('../utils/Logger')

class HttpResponseError extends Error {
  constructor({ code = 500, message }) {
    super(message)
    this.code = code
    this.message = message
  }
}

class NotFoundError extends HttpResponseError {
  constructor(msg) {
    super({ code: 404, message: `Not Found: ${msg}` })
  }
}

class BadRequestError extends HttpResponseError {
  constructor(msg) {
    super({ code: 400, message: `Bad Request: ${msg}` })
  }
}

class InternalError extends HttpResponseError {
  constructor({ message, req }) {
    super({ code: 500, message, req })
  }
}

class UnauthorizedError extends HttpResponseError {
  constructor({ message }) {
    super({ code: 401, message })
  }
}

class IncorrectSupplierError extends HttpResponseError {
  constructor({ message }) {
    super({ code: 400, message })
  }
}

class RecipeDoesNotExistError extends HttpResponseError {
  constructor({ message }) {
    super({ code: 400, message })
  }
}

class ItemNotFoundError extends HttpResponseError {
  constructor({ message }) {
    super({ code: 404, message })
  }
}

class NotAcceptableError extends HttpResponseError {
  constructor({ message }) {
    super({ code: 406, message })
  }
}

const handleErrors = (err, req, res, next) => {
  if (err instanceof HttpResponseError) {
    logger.warn(`Error in ${req.path} message: ${err.message}`, req)
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
    res.status(err.status).send(err.expose ? err.message : 'Unknown error')
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
  UnauthorizedError,
  NotFoundError,
  IncorrectSupplierError,
  InternalError,
  RecipeDoesNotExistError,
  ItemNotFoundError,
  NotAcceptableError,
}

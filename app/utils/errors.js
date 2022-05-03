const logger = require('../logger')

class FileUploadError extends Error {
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
    case FileUploadError:
      res.status(err.code).send(err.message)
      break
    default:
      res.status(500).send(err.message)
  }
}

module.exports = {
  errorResponse,
  FileUploadError,
}

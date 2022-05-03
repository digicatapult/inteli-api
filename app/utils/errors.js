class FileUploadError extends Error {
  constructor({ code, message, service }) {
    super(message)
    this.code = code
    this.message = message
    this.service = service
  }
}

module.exports = {
  FileUploadError,
}

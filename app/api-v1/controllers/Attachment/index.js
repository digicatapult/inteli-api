const { parseAccept } = require('../../../utils/parseAcceptHeader')
const logger = require('../../../utils/Logger')

const db = require('../../../db')

const { createAttachmentFromFile, createAttachment } = require('../Attachment/helpers')
const { NotFoundError, BadRequestError, NotAcceptableError } = require('../../../utils/errors')

const buildOctetHeader = (filename) => ({
  immutable: true,
  maxAge: 365 * 24 * 60 * 60 * 1000,
  'content-disposition': `attachment; filename="${filename}"`,
  'access-control-expose-headers': 'content-disposition',
  'content-type': 'application/octet-stream',
})

module.exports = {
  getAll: async function () {
    return { status: 500, response: { message: 'Not Implemented' } }
  },
  get: async function (req) {
    const { id } = req.params
    if (!id) throw new BadRequestError('missing params')

    const [attachment] = await db.getAttachment(req.params.id)
    if (!attachment) throw new NotFoundError('Attachment Not Found')
    const orderedAccept = parseAccept(req.headers.accept)

    if (attachment.filename === 'json') {
      for (const mimeType of orderedAccept) {
        if (mimeType === 'application/json' || mimeType === 'application/*' || mimeType === '*/*') {
          const json = JSON.parse(attachment.binary_blob)
          return { status: 200, response: json }
        }
        if (mimeType === 'application/octet-stream') {
          return {
            status: 200,
            response: attachment.binary_blob,
            headers: buildOctetHeader(attachment.filename),
          }
        }
      }
      throw new NotAcceptableError({ message: 'Client file request not supported' })
    } else {
      for (const mimeType of orderedAccept) {
        if (mimeType === 'application/octet-stream' || mimeType === 'application/*' || mimeType === '*/*') {
          return {
            status: 200,
            headers: buildOctetHeader(attachment.filename),
            response: attachment.binary_blob,
          }
        }
        throw new NotAcceptableError({ message: 'Client file request not supported' })
      }
    }
  },
  create: async (req) => {
    if (req.headers['content-type'] === 'application/json') {
      logger.info('JSON attachment upload: %j', req.body)
      const buffer = Buffer.from(JSON.stringify(req.body))
      const [result] = await createAttachment('json', buffer)
      return {
        status: 201,
        response: { ...result, size: buffer.length },
      }
    }

    logger.info('File attachment upload: %s', req.file)

    if (!req.file) {
      throw new BadRequestError('No file uploaded')
    }

    const [result] = await createAttachmentFromFile(req.file)
    return {
      status: 201,
      response: { ...result, size: req.file.size },
    }
  },
}

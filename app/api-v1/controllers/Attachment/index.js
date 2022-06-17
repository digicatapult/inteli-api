const { parseAccept } = require('../../../utils/parseAcceptHeader')
const logger = require('../../../utils/Logger')

const db = require('../../../db')

const { createAttachmentFromFile, createAttachment } = require('../Attachment/helpers')
const { InternalError, NotFoundError, BadRequestError, NotAcceptableError } = require('../../../utils/errors')

module.exports = {
  getAll: async function () {
    return { status: 500, response: { message: 'Not Implemented' } }
  },
  get: async (req) => {
    const { id } = req.params
    if (!id) throw new BadRequestError('missing params')

    const [attachment] = await db.getAttachment(req.params.id)
    if (!attachment) throw new NotFoundError('Attachment Not Found')
    const orderedAccept = parseAccept(req.headers.accept)

    for (const mimeType of orderedAccept) {
      if (mimeType === 'application/octet-stream' && attachment.filename.includes('json')) {
        throw new NotAcceptableError('Client file request not supported')
      }

      if (mimeType === 'application/json' || mimeType === 'application/*' || mimeType === '*/*') {
        const json = JSON.parse(attachment.binary_blob)
        return {
          status: 200,
          response: json,
        }
      }
      if (mimeType === 'application/octet-stream') {
        return {
          status: 200,
          headers: {
            immutable: true,
            maxAge: 365 * 24 * 60 * 60 * 1000,
            'content-disposition': `attachment; filename="${attachment.filename}"`,
            'access-control-expose-headers': 'content-disposition',
            'content-type': 'application/octet-stream',
          },
          response: attachment.binary_blob.toString(),
        }
      }
    }

    throw new InternalError({ message: 'Client file request not supported' })
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

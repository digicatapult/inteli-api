const { parseAccept } = require('../../../utils/parseAcceptHeader')
const logger = require('../../../utils/Logger')

const db = require('../../../db')

const { createAttachmentFromFile, createAttachment } = require('../Attachment/helpers')
const { InternalError, NotFoundError, BadRequestError } = require('../../../utils/errors')

module.exports = {
  get: async (req) => {
    /*
    if (orderedAccept.includes(jsonMimeTypes) && filename === 'json') {
        return {
          status: 200,
          response: JSON.parse(JSON.stringify(attachment)),
        }
      }

      return returnWithFile(attachment)
  */
    const { id } = req.params
    if (!id) throw new BadRequestError('missing params')

    const [attachment] = await db.getAttachment(req.params.id)
    if (!attachment) throw new NotFoundError('Attachment Not Found')

    const orderedAccept = parseAccept(req.headers.accept)

    for (const mimeType of orderedAccept) {
      if (mimeType === 'application/json' || mimeType === 'application/*' || mimeType === '*/*') {
        try {
          const json = JSON.parse(JSON.stringify(attachment.binary_blob))
          return { status: 201, response: { binary_blob: json, filename: attachment.filename, id: attachment.id } }
        } catch (error) {
          throw new InternalError({ message: error })
        }
      }
      if (mimeType === 'application/octet-stream') {
        return {
          status: 201,
          response: {
            headers: {
              immutable: true,
              maxAge: 365 * 24 * 60 * 60 * 1000,
              'content-disposition': `attachment; filename="${attachment.filename}"`,
              'access-control-expose-headers': 'content-disposition',
              'content-type': 'application/octet-stream',
            },
            file: { binary_blob: attachment.binary_blob, filename: attachment.filename, id: attachment.id },
          },
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

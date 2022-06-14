const { parseAccept } = require('../../../utils/parseAcceptHeader')
const logger = require('../../../utils/Logger')

const db = require('../../../db')

const { createAttachmentFromFile, createAttachment } = require('../Attachment/helpers')
const { InternalError, NotFoundError, BadRequestError } = require('../../../utils/errors')

module.exports = {
  get: async (req, res) => {
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
          const json = JSON.parse(attachment.binary_blob)
          res.status(200).json(json)
        } catch (error) {
          throw new InternalError({ message: error })
        }
        return
      }
      if (mimeType === 'application/octet-stream') {
        console.log(attachment)
        res.status(200)
        res.set({
          immutable: true,
          maxAge: 365 * 24 * 60 * 60 * 1000,
          'content-disposition': `attachment; filename="${attachment.filename}"`,
          'access-control-expose-headers': 'content-disposition',
          'content-type': 'application/octet-stream',
        })
        res.send(attachment.binary_blob)
        return
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

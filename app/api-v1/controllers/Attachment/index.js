import { parseAccept } from '../../../utils/parseAcceptHeader'
const db = require('../../../db')

const { InternalError, NotFoundError } = require('../../../utils/errors')

module.exports = {
  get: async (req, res) => {
    const [attachment] = await db.getAttachment(req.params.id)
    if (!attachment) throw new NotFoundError('Attachment Not Found')

    const filename = attachment.filename
    const orderedAccept = parseAccept(req.headers.accept)

    if (filename === 'json') {
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
    } else {
      for (const mimeType of orderedAccept) {
        if (mimeType === 'application/octet-stream' || mimeType === 'application/*' || mimeType === '*/*') {
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
        throw new InternalError({ message: 'Client file request not supported' })
      }
    }
  },
  create: async (req) => {},
}

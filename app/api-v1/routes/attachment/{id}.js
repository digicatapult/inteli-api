// eslint-disable-next-line no-unused-vars
const { BadRequestError } = require('../../../utils/errors')
module.exports = function (attachmentService) {
  const doc = {
    GET: async function (req, res) {
      const response = await attachmentService.getAttachmentByID(req.params.id)

      if (req.headers.accept.includes('json') && response.filename === 'json') {
        res.status(200).json(response)
      } else if (req.headers.accept.includes('json') && response.filename != 'json') {
        throw new BadRequestError({ message: 'Filename does not match JSON' })
      } else {
        res.status(200)
        res.set({
          immutable: true,
          maxAge: 365 * 24 * 60 * 60 * 1000,
          'content-disposition': `attachment; filename="${response.filename}"`,
          'access-control-expose-headers': 'content-disposition',
          'content-type': 'application/octet-stream',
        })
        res.send(response.binary_blob)
      }
    },
  }

  doc.GET.apiDoc = {
    summary: 'GET attachment by id',
    parameters: [
      {
        description: 'Id of the attachment to get',
        in: 'path',
        required: true,
        name: 'id',
        allowEmptyValue: false,
        schema: {
          $ref: '#/components/schemas/ObjectReference',
        },
      },
    ],
    responses: {
      200: {
        description: 'Return attachment',
        content: {
          'application/octet-stream': {
            schema: {
              description: 'Attachment file',
              type: 'string',
              format: 'binary',
            },
          },
          'application/json': {
            schema: {
              description: 'Attachment json',
              anyOf: [
                {
                  type: 'object',
                  properties: {},
                  additionalProperties: true,
                },
                {
                  type: 'array',
                  items: {},
                },
              ],
            },
            example: {},
          },
        },
      },
      default: {
        description: 'An error occurred',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/Error',
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: ['attachment'],
  }

  return doc
}

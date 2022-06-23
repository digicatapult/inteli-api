const { getDefaultSecurity } = require('../../../utils/auth')
const attachment = require('../../controllers/Attachment')

module.exports = function () {
  const doc = {
    GET: async (req, res) => {
      const { status, response, headers } = await attachment.getById(req)
      if (headers) res.set(headers)
      res.status(status).send(response)
    },
  }

  doc.GET.apiDoc = {
    summary: 'GET attachment by id',
    description: `Downloads a file {id}. Content can either be a file (application/octet-stream) or JSON (application/json).`,
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
                  example: { some: 'example JSON' },
                },
                {
                  type: 'array',
                  items: {
                    type: 'object',
                    example: { some: 'example JSON' },
                  },
                },
              ],
            },
          },
        },
      },
    },
    security: getDefaultSecurity(),
    tags: ['attachment'],
  }

  return doc
}

const { getDefaultSecurity } = require('../../../utils/auth')
const { buildValidatedJsonHandler } = require('../../../utils/routeResponseValidator')
const attachmentController = require('../../controllers/Attachment')

module.exports = function () {
  const doc = {
    GET: buildValidatedJsonHandler(attachmentController.get, {
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
                  {
                    type: 'string',
                  },
                ],
              },
              example: {},
            },
            'application/octet-stream': {
              schema: {
                description: 'Attachment file',
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      },
      security: getDefaultSecurity(),
      tags: ['attachment'],
    }),
  }
  return doc
}

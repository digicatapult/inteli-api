const { getDefaultSecurity } = require('../../../../../utils/auth')
const partController = require('../../../../controllers/Part')
const { buildValidatedJsonHandler } = require('../../../../../utils/routeResponseValidator')

// eslint-disable-next-line no-unused-vars
module.exports = function () {
  const doc = {
    GET: buildValidatedJsonHandler(partController.transaction.get, {
      summary: 'Get Part Certification Action',
      parameters: [
        {
          description: 'Id of the part',
          in: 'path',
          required: true,
          name: 'id',
          allowEmptyValue: false,
          schema: {
            $ref: '#/components/schemas/ObjectReference',
          },
        },
        {
          description: 'Id of the part certification action',
          in: 'path',
          required: true,
          name: 'certificationId',
          allowEmptyValue: false,
          schema: {
            $ref: '#/components/schemas/ObjectReference',
          },
        },
      ],
      responses: {
        200: {
          description: 'Return Part Certification Action',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PartCertification',
              },
            },
          },
        },
        404: {
          description: 'Part not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotFoundError',
              },
            },
          },
        },
      },
      security: getDefaultSecurity(),
      tags: ['part'],
    }),
  }

  return doc
}

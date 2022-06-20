const { getDefaultSecurity } = require('../../../../../utils/auth')
const orderController = require('../../../../controllers/Order')
const { buildValidatedJsonHandler } = require('../../../../../utils/routeResponseValidator')

// eslint-disable-next-line no-unused-vars
module.exports = function (orderService) {
  const doc = {
    GET: buildValidatedJsonHandler(orderController.transaction.get, {
      summary: 'Get Purchase Orders Rejection Action',
      description: 'Returns the details of the on-chain transaction {rejectionId} to reject the order {id}.',
      parameters: [
        {
          description: 'Id of the purchase-order',
          in: 'path',
          required: true,
          name: 'id',
          allowEmptyValue: false,
          schema: {
            $ref: '#/components/schemas/ObjectReference',
          },
        },
        {
          description: 'Id of the rejection action',
          in: 'path',
          required: true,
          name: 'rejectionId',
          allowEmptyValue: false,
          schema: {
            $ref: '#/components/schemas/ObjectReference',
          },
        },
      ],
      responses: {
        200: {
          description: 'Return Purchase Order Rejection Action',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/OrderRejection',
              },
            },
          },
        },
        404: {
          description: 'Rejection action not found',
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
      tags: ['order'],
    }),
  }

  return doc
}

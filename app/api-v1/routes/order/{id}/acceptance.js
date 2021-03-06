const { getDefaultSecurity } = require('../../../../utils/auth')
const order = require('../../../controllers/Order')
const { buildValidatedJsonHandler } = require('../../../../utils/routeResponseValidator')

module.exports = function () {
  const doc = {
    GET: buildValidatedJsonHandler(order.transaction.get, {
      summary: 'List Purchase Orders Acceptance Actions',
      description: 'Returns the details of all on-chain transactions to accept the order {id}.',
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
      ],
      responses: {
        200: {
          description: 'Return Purchase Order Acceptance Actions',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/OrderAcceptance',
                },
              },
            },
          },
        },
        404: {
          description: 'Order not found',
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
    POST: buildValidatedJsonHandler(order.transaction.create, {
      summary: 'Create Purchase Order Acceptance Action',
      description: 'A Supplier accepts the order {id}. Order must be in `Submitted` or `Amended` state.',
      parameters: [
        {
          description: 'Id of the purchase-order. Must be in "Submitted" or "Amended" state',
          in: 'path',
          required: true,
          name: 'id',
          allowEmptyValue: false,
          schema: {
            $ref: '#/components/schemas/ObjectReference',
          },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/NewOrderAcceptance',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Purchase Order Acceptance Created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/OrderAcceptance',
              },
            },
          },
        },
        400: {
          description: 'Invalid request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BadRequestError',
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

const orderController = require('../controllers/Order')
const { buildValidatedJsonHandler } = require('../../utils/routeResponseValidator')
const { BadRequestError } = require('../../utils/errors')
const { getDefaultSecurity } = require('../../utils/auth')

module.exports = function (orderService, identityService) {
  const doc = {
    GET: buildValidatedJsonHandler(orderController.getAll, {
      summary: 'List Purchase Orders',
      description: 'Returns all orders.',
      parameters: [],
      responses: {
        200: {
          description: 'Return Purchase Orders',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Order',
                },
              },
            },
          },
        },
      },
      security: getDefaultSecurity(),
      tags: ['order'],
    }),
    POST: buildValidatedJsonHandler(
      async function (req) {
        if (!req.body) {
          throw new BadRequestError({ message: 'No body uploaded', req })
        }

        const { address: supplierAddress } = await identityService.getMemberByAlias(req, req.body.supplier)
        const selfAddress = await identityService.getMemberBySelf(req)
        const { alias: selfAlias } = await identityService.getMemberByAlias(req, selfAddress)

        const { statusCode, result } = await orderService.postOrder({
          ...req.body,
          supplier: supplierAddress,
          purchaserAddress: selfAlias,
        })

        return {
          status: statusCode,
          response: {
            id: result.id,
            status: 'Created',
            purchaser: selfAlias,
            ...req.body,
          },
        }
      },
      {
        summary: 'Create Purchase Order',
        description:
          'A Buyer creates a new order containing a list of recipes. One part is ordered per recipe. Multiple parts can be ordered by listing the same recipe ID multiple times. Supplier in the request body must match `supplier` on each recipe. The order is not yet viewable to other members',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NewOrder',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Purchase Order Created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Order',
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
      }
    ),
  }

  return doc
}

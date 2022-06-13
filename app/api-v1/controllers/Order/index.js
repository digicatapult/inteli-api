const { runProcess } = require('../../../utils/dscp-api')
const db = require('../../../db')
const { BadRequestError, NotFoundError } = require('../../../utils/errors')
const { mapOrderData } = require('./helpers')

module.exports = {
  getAll: async function () {
    return { status: 500, response: { message: 'Not Implemented' } }
  },
  get: async function () {
    return { status: 500, response: { message: 'Not Implemented' } }
  },
  transaction: {
    getAll: async () => {
      return { status: 500, response: { message: 'Not Implemented' } }
    },
    get: async () => {
      return { status: 500, response: { message: 'Not Implemented' } }
    },
    create: async (req) => {
      const { id } = req.params
      if (!id) throw new BadRequestError('missing params')

      const [order] = await db.getOrder(id)
      if (!order) throw new NotFoundError('order')

      const transaction = await db.insertOrderTransaction(id)
      const payload = {
        inputs: [],
        outputs: [{
          roles: { Owner: 'self-get-from-identity', Buyer: '', Supplier: order.supplier },
          metadata: mapOrderData({ ...order, transaction }),
        }]
      }

      runProcess(payload, req.token)

      return {
        status: 201,
        ...transaction,
      }
    },
  },
}

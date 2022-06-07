const { runProcess } = require('../../../utils/dscp-api')
const db = require('../../../db')
const { BadRequestError, NotFoundError } = require('../../../utils/errors')

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

      const payload = {
        inputs: [],
        outputs: [{
          roles: { Owner: 'abc' },
          metadata: {},
        }]
      }

      runProcess(payload, req.token)
      const transaction = await db.insertOrderTransaction(id)

      return {
        status: 201,
        ...transaction,
      }
    },
  },
}

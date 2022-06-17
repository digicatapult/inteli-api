const { runProcess } = require('../../../utils/dscp-api')
const db = require('../../../db')
const ext = require('./helpers')
const idenity = require('../../services/identityService')
const { BadRequestError, NotFoundError, IdentityError } = require('../../../utils/errors')

const _tmp = () => ({ status: 500, response: { message: 'Not Implemented' } })

module.exports = {
  post: async function (req) {
    if (!req.body) {
      throw new BadRequestError('missing req.body')
    }

    const { address: supplierAddress } = await idenity.getMemberByAlias(req, req.body.supplier)
    const selfAddress = await idenity.getMemberBySelf(req)
    const { alias: selfAlias } = await idenity.getMemberByAlias(req, selfAddress)

    const [result] = await db.postOrderDb(await ext.validate({
      ...req.body,
      supplier: supplierAddress,
      purchaserAddress: selfAlias,
      status: 'Created',
      purchaser: selfAddress,
    }))

    return {
      status: 201,
      response: {
        ...result,
        ...req.body,
      },
    }
  },
  getAll: _tmp,
  get: _tmp,
  transaction: {
    getAll: _tmp,
    get: _tmp,
    create: async (req) => {
      const { id } = req.params
      if (!id) throw new BadRequestError('missing params')

      const [order] = await db.getOrder(id)
      if (!order) throw new NotFoundError('order')

      const selfAddress = await idenity.getMemberBySelf()
      if (!selfAddress) throw new IdentityError()

      const transaction = await db.insertOrderTransaction(id)
      const payload = await mapOrderData({ ...order, selfAddress, transaction, ...req.body })

      runProcess(payload, req.token)

      return {
        status: 201,
        transaction,
      }
    },
  },
}

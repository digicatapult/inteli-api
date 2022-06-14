const db = require('../../../db')
const { NoTokenError, NothingToProcess } = require('../../../utils/errors')

/*eslint-disable */
const buildRecipeOutputs = (data, n) => new Array(n).fill({
  roles: {
    Owner: data.selfAddress,
    Buyer: data.selfAddress,
    Supplier: data.supplier,
  },
  metadata: { type: { type: 'LITERAL', value: 'RECIPE' } },
})

const buildOrderOutput = (data, recipes) => ({
  roles: {
    Owner: data.supplier,
    Buyer: data.selfAddress,
    Supplier: data.supplier,
  },
  metadata: {
    type: { type: 'LITERAL', value: 'ORDER' },
    status: { type: 'LITERAL', value: data.status },
    requiredBy: { type: 'LITERAL', value: data.requiredBy },
    transactionId: { type: 'LITERAL', value: data.transaction.id.replace(/[-]/g, '') },
    ...recipes,
    },
})
/*eslint-enable */

exports.mapOrderData = async (data) => {
  if (!data.items || data.items.length < 1) throw new NothingToProcess()
  const records = await db.getRecipeByIDs(data.items)
  const tokenIds = records.map((el) => el.token_id)
  if (!tokenIds.every(Boolean)) throw new NoTokenError('recipes')

  const recipes = tokenIds.reduce((output, id) => {
    if (id) {
      output[id] = {
        type: 'TOKEN_ID',
        value: id,
      }
    }

    return output
  }, {})

  return {
    inputs: tokenIds,
    outputs: [buildOrderOutput(data, recipes), ...buildRecipeOutputs(data, tokenIds.length)],
  }
}

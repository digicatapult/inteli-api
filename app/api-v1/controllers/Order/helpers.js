const db = require('../../../db')
const { NoToken } = require('../../../utils/errors')

exports.mapOrderData = async (data) => {
  const tokenIds = await db.getRecipeByIDs(data.items).map(el => el.token_id)
  if(!tokenIds.every(Boolean)) throw new NoToken('order')

  const recipes = data.items.reduce((id, output) => {
    if (id) {
      output[id] = {
        type: 'TOKEN_ID',
        value: id,
      }
    }

    return output
  }, {})

  return {
    type: { type: 'LITERAL', value: 'ORDER' },
    status: { type: 'LITERAL', value: data.status },
    requiredBy: { type: 'LITERAL', value: data.requiredBy },
    transactionId: { type: 'LITERAL', value: data.transaction.id },
    ...recipes,
  }
}

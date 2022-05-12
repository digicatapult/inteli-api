const { runProcess } = require('../../../utils/PolkadotApi')
const { client } = require('../../../db')
const { mapRecipeData } = require('./helpers')
const { BadRequestError, NotFoundError } = require('../../../utils/errors')

module.exports = {
  transaction: {
    create: async (req) => {
      const service = '/recipe/{id}/creation'
      const { id } = req.params
      if (!id) throw new BadRequestError({ // TODO confirm POST body
        message: 'missing [id] param from request',
        service,
      })
    
      const recipe = await client.from('recipes').select('*').where({ id })
      console.log({ recipe })
      if (!recipe) throw new NotFoundError({
        message: 'recipe not found',
        service,
      })

      const token = await runProcess({
        inputs: [],
        outputs: [{
          metadata: mapRecipeData(recipe),
        }]
      })

      console.log({ token })

      const transaction = await client.from('transactions').select(['id']).insert({
        type: 'recipe',
        token_id: token[0],
        item_id: id,
        status: 'submitted',
      }).then(t => t[0])

      return { 
        status: 200,
        message: `transaction ${transaction.id} has been created`,
      }
    }
  }
}

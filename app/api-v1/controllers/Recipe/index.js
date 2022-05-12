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
      if (!recipe || !recipe.length) throw new NotFoundError({
        message: 'recipe not found',
        service,
      })

      const token = await runProcess({
        inputs: [],
        outputs: [{
          roles: { Owner: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
          metadata: mapRecipeData(recipe),
        }]
      })

      const transaction = await client.from('recipe_transactions').insert({
        token_id: token[0],
        recipe_id: id,
        status: 'submitted',
      }).returning(['id']).then(t => t[0])

      return { 
        status: 200,
        message: `transaction ${transaction.id} has been created`,
      }
    }
  }
}

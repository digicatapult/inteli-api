const { runProcess } = require('../../../utils/PolkadotApi')
const { client } = require('../../../db')
const { mapRecipeData } = require('./helpers')

module.exports = {
  transaction: {
    create: async (req, res, next) => {
      const { id } = req.params
      try {
        // 1. TODO confim POST body
        // 2. TODO export like db.Recipe.insert()
        const recipe = await client('recipe').where({ id }).first()
        // 3. TODO confirm handling of local db record
        if (!recipe) return res.status(404).send('not found')
        const token = await runProcess({
          inputs: [],
          outputs: [{
            metadata: mapRecipeData(recipe), // 4. TODO confirm metadata object
          }]
        })
        const transaction = await client('transactions').insert({
          type: 'recipe',
          token_id: token[0],
          item_id: id,
          status: 'submitted',
        }).returning(['id']).then(t => t[0])

        res.send({ 
          message: `transaction ${transaction.id} has been created`,
        })
      } catch (err) {
        return next(err)
      }
    }
  }
}

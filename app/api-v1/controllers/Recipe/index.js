const { runProcess } = require('../../../utils/PolkadotApi')


module.exports = {
  transaction: {
    create: async (req, res, next) => {
      const { id } = req.params
      try {
        // todo update db
        // create ne entry with status 'pending'
        const transactionIds = await runProcess(req.body, 'token')
        res.send({ 
          transactionIds,
          recipeId: id,
          message: 'transaction has been created'
        })
      } catch (err) {
        return next(err)
      }
    }
    // enrich (add token id, uniq id with each req)
    // create entry locally
    // returns something
  }
}
// mmm?
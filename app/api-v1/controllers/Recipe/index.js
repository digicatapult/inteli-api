const { runProcess } = require('../../../utils/PolkadotApi')


module.exports = {
  transaction: {
    create: (req, res) => {
      // no need to validate, apiDoc does it, wooO!
      const { id } = req.params


      console.log({ id, body: req.body })

      const process = {
        inputs: [],
        outputs: [{
          roles: {
            Owner: 'role-a',
          },
          metadata: {
            // req.body
            test: { type: 'LITERAL', value: 'some_value' }
          },
        }],
      }

      console.log('runProcess: ', runProcess(req.body, 'abc'))

      res.send('ok')
    }
    // enrich (add token id, uniq id with each req)
    // create entry locally
    // returns something
  }
}
// mmm?
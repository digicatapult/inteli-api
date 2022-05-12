const fetch = require('node-fetch')
const FormData = require('form-data')

const { POLKADOT_API } = require('../../env')

module.exports = {
  async runProcess(payload, authToken) {
    const url = `${POLKADOT_API}/v3/run-process`
    const formData = new FormData()
    formData.append('request', JSON.stringify(payload))

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    })

    return res.json()
  },
}

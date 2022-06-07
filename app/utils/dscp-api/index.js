const fetch = require('node-fetch')
const FormData = require('form-data')

const { DSCP_API_PORT, DSCP_API_HOST } = require('../../env')

module.exports = {
  async runProcess({ file, ...payload }, authToken) {
    const url = `http://${DSCP_API_HOST}:${DSCP_API_PORT}/v3/run-process`
    const formData = new FormData()
    formData.append('request', JSON.stringify(payload))
    if (file) formData.append('file', file, payload.filename)
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

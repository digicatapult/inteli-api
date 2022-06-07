const fetch = require('node-fetch')
const FormData = require('form-data')

const { DSCP_API_PORT, DSCP_API_HOST } = require('../../env')

module.exports = {
  async runProcess({ file, requiredCerts, ...payload }, authToken) {
    const url = `http://${DSCP_API_HOST}:${DSCP_API_PORT}/v3/run-process`
    console.log({ url })
    const formData = new FormData()
    formData.append('request', JSON.stringify(payload))
    if (requiredCerts) formData.append('file', requiredCerts, 'required_certs.json')
    console.log('testing...')
    if (file) formData.append('file', file, payload.outputs[0].metadata.image.value)
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

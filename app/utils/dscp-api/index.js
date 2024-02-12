const fetch = require('node-fetch')
const FormData = require('form-data')

const { SQNC_API_PORT, SQNC_API_HOST } = require('../../env')

module.exports = {
  async runProcess({ image, requiredCerts, ...payload }, authToken) {
    const url = `http://${SQNC_API_HOST}:${SQNC_API_PORT}/v3/run-process`
    const formData = new FormData()

    formData.append('request', JSON.stringify(payload))
    if (requiredCerts) formData.append('file', requiredCerts, 'required_certs.json')
    if (image) formData.append('file', image, payload.outputs[0].metadata.image.value)

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

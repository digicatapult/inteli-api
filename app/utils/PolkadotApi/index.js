const fetch = require('node-fetch')
const FormData = require('form-data')

// const { API_HOST, API_PORT } = require('../../env')
const url = `http://localhost:3001/v3/run-process`

module.exports = { 
  async runProcess(payload, authToken) {
    const formData = new FormData()
    formData.append('request', JSON.stringify(payload))

    console.log(payload.outputs[0].metadata)
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        authorization: `Bearer ${authToken}`
      }
    })

    return res.json()
  }
}

const fetch = require('node-fetch')
const FormData = require('form-data')

const { DSCP_API_HOST, DSCP_API_PORT, DSCP_API_MAJOR_VERSION } = require('../env')
const baseUrl = `http://${DSCP_API_HOST}:${DSCP_API_PORT}/${DSCP_API_MAJOR_VERSION}`

const lastTokenId = async (authToken) => {
  const res = await fetch(`${baseUrl}/last-token`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  })

  return res.json()
}

const getItemById = async (authToken, tokenId) => {
  const res = await fetch(`${baseUrl}/item/${tokenId}`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  })

  return res.json()
}

const runProcess = async (authToken, inputs, outputs) => {
  const formData = new FormData()
  formData.append('request', JSON.stringify({ inputs, outputs }))

  const res = await fetch(`${baseUrl}/run-process`, {
    method: 'POST',
    body: formData,
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  })

  return res.json()
}

module.exports = { lastTokenId, getItemById, runProcess }

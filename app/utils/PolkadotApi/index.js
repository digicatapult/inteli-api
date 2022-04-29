
// const { API_HOST, API_PORT } = require('../../env')
const url = `http://localhost:3000/v3/`

module.exports = { 
  async runProcess(body, token) {
    return 'transaction'

    /*
    return fetch(`${url}/run-process`, {
      method: 'POST',
      mode: 'cors',
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    */
  }
}

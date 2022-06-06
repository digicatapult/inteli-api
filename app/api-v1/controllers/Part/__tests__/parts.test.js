const { expect } = require('chai')
const partController = require('../index')

describe('part.getAll', () => {
  it('should resolve 500 error', async () => {
    const result = await partController.getAll()
    expect(result.status).to.equal(500)
  })
})

describe('part.get', () => {
  it('should resolve 500 error', async () => {
    const result = await partController.get()
    expect(result.status).to.equal(500)
  })
})

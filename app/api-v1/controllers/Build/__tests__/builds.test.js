const { expect } = require('chai')
const buildController = require('../index')

describe('build.getAll', () => {
  it('should resolve 500 error', async () => {
    const result = await buildController.getAll()
    expect(result.status).to.equal(500)
  })
})

describe('build.create', () => {
  it('should resolve 500 error', async () => {
    const result = await buildController.create()
    expect(result.status).to.equal(500)
  })
})

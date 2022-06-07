const { expect } = require('chai')
const orderController = require('../index')

describe('order.getAll', () => {
  it('should resolve 500 error', async () => {
    const result = await orderController.getAll()
    expect(result.status).to.equal(500)
  })
})

describe('order.get', () => {
  it('should resolve 500 error', async () => {
    const result = await orderController.get()
    expect(result.status).to.equal(500)
  })
})

describe('order.transaction', () => {
  describe('getAll', () => {
    it('should resolve 500 error', async () => {
      const result = await orderController.transaction.getAll()
      expect(result.status).to.equal(500)
    })
  })

  describe('get', () => {
    it('should resolve 500 error', async () => {
      const result = await orderController.transaction.get()
      expect(result.status).to.equal(500)
    })
  })

  describe('create transaction controller', () => {
    describe('if invalid parameter supplied', () => {
      it('returns 400 and an innstance of BadRequestError', () => {

      })
      it('does not perform any database queries', () => {

      })
      it('does not call runProcess', () => {

      })
    })

    describe('if order can not be found', () => {
      it('returns 404 along with instance of NotFoundError ', () => {

      })
      it('does not call runProcess', () => {

      })
      it('does not attempt to insert a order_transaction', () => {

      })
    })

    it('retrieves order details from database', () => {

    })
    it('formats payload', () => {

    })
    it('calls run process ... ', () => {

    })
    it('creates new entry in order_transactions table', () => {

    })
    it('returns 201 along with other details as per api-doc', () => {
      
    })
  })
})

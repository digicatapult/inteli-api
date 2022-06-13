const nock = require('nock')
const { expect } = require('chai')
const { stub } = require('sinon')

const orderController = require('../index')
const db = require('../../../../db')
const { BadRequestError, NotFoundError } = require('../../../../utils/errors')
const { DSCP_API_HOST, DSCP_API_PORT } = require('../../../../env')

const dscpApiUrl = `http://${DSCP_API_HOST}:${DSCP_API_PORT}`
const createTransaction = async (req) => {
  try {
    return await orderController.transaction.create(req)
  } catch (err) {
    return err
  }
}

describe('Order controller', () => {
  let stubs = {}
  let response
  let runProcessBody
  let runProcessReq

  before(async () => {
    runProcessReq = nock(dscpApiUrl)
      .post('/v3/run-process', (body) => {
        runProcessBody = body
        return true
      })
      .reply(200, [20])
  })

  afterEach(() => {
    stubs = {}
    nock.cleanAll()
  })

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

    describe.only('transactions /create', () => {
      beforeEach(async () => {
        stubs.insertTransactionStub = stub(db, 'insertOrderTransaction').resolves([])
        stubs.getOrderStub = stub(db, 'getOrder').resolves([])
      })
      afterEach(() => {
        stubs.insertTransactionStub.restore()
        stubs.getOrderStub.restore()
      })

      describe('if invalid parameter supplied', () => {
        beforeEach(async () => {
          response = await createTransaction({ params: { a: 'a' } })
        })

        it('returns 400 and an innstance of BadRequestError', () => {
          expect(response).to.be.an.instanceOf(BadRequestError)
          expect(response.message).to.be.equal('Bad Request: missing params')
        })

        it('does not perform any database queries', () => {
          expect(stubs.insertTransactionStub.calledOnce).to.equal(false)
        })

        it('does not call runProcess', () => {
          expect(runProcessReq._eventsCount).to.equal(0)
          expect(runProcessBody).to.be.undefined
        })
      })

      describe('if order can not be found', () => {
        beforeEach(async () => {
          response = await createTransaction({ params: { id: '00000000-0000-1000-3000-000000000001' } })
        })

        it('returns 404 along with instance of NotFoundError ', () => {
          expect(response).to.be.an.instanceOf(NotFoundError)
          expect(response.message).to.be.equal('Not Found: order')
        })

        it('does not attempt to insert a order_transaction', () => {
          expect(stubs.insertTransactionStub.calledOnce).to.equal(false)
        })

        it('does not call runProcess', () => {
          expect(runProcessReq._eventsCount).to.equal(0)
          expect(runProcessBody).to.be.undefined
        })
      })

      describe('if contains invalid recipe ids', () => {
        // TODO coonfirm checks withs matt
        it('return an error', () => {})
        it('does not call create transaction db method', () => {})
      })

      describe('happy path', () => {
        // main reason for wrapping int oths so I can utlise before each
        beforeEach(async () => {
          stubs.insertTransactionStub.restore()
          stubs.getOrderStub.restore()
          stubs.insertTransactionStub = stub(db, 'insertOrderTransaction').resolves({
            id: '50000000-0000-1000-3000-000000000001',
            status: 'Submitted',
            createdAt: '2022-06-11T08:47:23.397Z',
          })
          stubs.getOrderStub = stub(db, 'getOrder').resolves([
            {
              status: 'submitted',
              requiredBy: '2022-06-11T08:47:23.397Z',
            },
          ])
          response = await createTransaction({
            // TODO mooe to fixtures
            params: { id: '00000000-0000-1000-3000-000000000001' },
            body: {
              items: ['00000001-0000-1000-3000-000000001001', '00000001-0000-1000-3000-000000002001'],
            },
          })
        })

        it('retrieves order details from database', () => {
          expect(stubs.getOrderStub.getCall(0).args[0]).to.deep.equal('00000000-0000-1000-3000-000000000001')
        })

        it('calls run process with formatted boody', () => {
          expect(runProcessReq.isDone()).to.equal(true)
          expect(runProcessBody).to.be.undefined
        })

        it('call database method to insert a new entry in order_transactions', () => {
          expect(stubs.insertTransactionStub.getCall(0).args[0]).to.deep.equal('00000000-0000-1000-3000-000000000001')
        })

        it('returns 201 along with other details as per api-doc', () => {
          expect(response.status).to.equal(201)
          expect(response.transaction).to.deep.equal({
            id: '50000000-0000-1000-3000-000000000001',
            status: 'Submitted',
            createdAt: '2022-06-11T08:47:23.397Z',
          })
        })
      })
    })
  })
})

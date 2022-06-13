const nock = require('nock')
const { expect } = require('chai')
const { stub } = require('sinon')

const attachmentController = require('../index')
const { BadRequestError, NotFoundError } = require('../../../../utils/errors')
const { jsonAttachment } = require('../__tests__/attachments_fixtures')
const db = require('../../../../db')

const getAttachment = async (req) => {
  try {
    return await attachmentController.get(req)
  } catch (err) {
    return err
  }
}

describe.only('Attachment controller', () => {
  let stubs = {}
  let response

  describe('Attachment /GET', () => {
    beforeEach(async () => {
      stubs.getAttachment = stub(db, 'getAttachment').resolves([])
    })
    afterEach(() => {
      stubs.getAttachment.restore()
    })

    describe('if req.params.id is not provided', () => {
      beforeEach(async () => {
        response = await getAttachment({ params: {} })
      })

      it('throws a validation error', async () => {
        expect(response).to.be.an.instanceOf(BadRequestError)
        expect(response.message).to.be.equal('Bad Request: missing params')
      })

      it('does not perform any database calls and does not create transaction', () => {
        expect(stubs.getAttachment.calledOnce).to.equal(false)
      })
    })

    describe('if no attachments are found with a given ID', () => {
      beforeEach(async () => {
        response = await getAttachment({ params: { id: '1000000-2000-1000-8000-000000000000' } })
      })

      it('throws an error', () => {
        expect(response.code).to.be.equal(404)
        expect(response).to.be.an.instanceOf(NotFoundError)
        expect(response.message).to.be.equal('Not Found: Attachment Not Found')
      })
    })

    //NOT WORKING BELOW

    describe.only('happy path', () => {
      beforeEach(async () => {
        stubs.getAttachment.restore()
        stubs.insertAttachment = stub(db, 'insertAttachment').resolves({
          id: jsonAttachment.id,
          name: jsonAttachment.filename,
        })
        stubs.getAttachment = stub(db, 'getAttachment').resolves([jsonAttachment])
        response = await getAttachment({ params: { id: jsonAttachment.id, accept: 'application/json' } })
      })

      it('returns an attachment', () => {
        const { status, response: body } = response
        console.log(response)
        expect(status).to.be.equal(200)
        expect(body).to.deep.equal(jsonAttachment)
      })
    })
  })
})

const nock = require('nock')
const { expect } = require('chai')
const { stub } = require('sinon')

const attachmentController = require('../index')
const { BadRequestError, NotFoundError } = require('../../../../utils/errors')
const { jsonAttachment, fileAttachment } = require('../__tests__/attachments_fixtures')
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
  beforeEach(() => {
    stubs.insertAttachment = stub(db, 'insertAttachment').resolves({
      id: jsonAttachment.id,
      name: jsonAttachment.filename,
    })
    stubs.getAttachment = stub(db, 'getAttachment').resolves([])
  })

  afterEach(() => {
    stubs.getAttachment.restore()
    stubs.insertAttachment.restore()
  })

  describe('Attachment /GET', () => {
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

    /******* These tests require a res object being sent so currently do not return
     * as errors such as 'TypeError: Cannot read property 'status' of undefined' appear
     */

    describe.only('happy path - file attachment', () => {
      beforeEach(async () => {
        stubs.getAttachment.resolves([fileAttachment])
        response = await getAttachment({
          params: { id: fileAttachment.id },
          headers: { accept: 'application/octet-stream' },
        })
      })

      it('returns an attachment', () => {
        const { status, response: body } = response
        console.log(response)
        expect(status).to.be.equal(200)
        expect(body).to.deep.equal(fileAttachment)
      })
    })

    describe.only('happy path - json attachment', () => {
      beforeEach(async () => {
        stubs.getAttachment.resolves([jsonAttachment])
        response = await getAttachment({
          params: { id: jsonAttachment.id },
          headers: { accept: 'application/json' },
        })
      })

      it('returns an attachment', () => {
        const { status, response: body } = response
        console.log(response)
        expect(status).to.be.equal(200)
        expect(body).to.deep.equal(jsonAttachment)
      })
    })
    /********************************* */
  })
})

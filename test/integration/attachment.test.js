const { describe, before, it } = require('mocha')
const { expect } = require('chai')

const { createHttpServer } = require('../../app/server')
const { postAttachment, postAttachmentNoFile } = require('../helper/routeHelper')
const { FILE_UPLOAD_SIZE_LIMIT_BYTES } = require('../../app/env')

describe('Attachments', function () {
  describe('valid file upload', function () {
    let app

    before(async function () {
      app = await createHttpServer()
    })

    it('should return 201 - file upload', async function () {
      const response = await postAttachment(app, Buffer.from('a'.repeat(100)))

      expect(response.status).to.equal(201)
      expect(response.body).to.have.property('id')
      expect(response.body.filename).to.equal('test.pdf')
      expect(response.body.size).to.equal(100)
    })
  })

  describe('invalid file upload', function () {
    let app

    before(async function () {
      app = await createHttpServer()
    })

    it('should return 400 - over file size limit', async function () {
      const response = await postAttachment(app, Buffer.alloc(FILE_UPLOAD_SIZE_LIMIT_BYTES + 1))

      expect(response.status).to.equal(400)
      expect(response.error.text).to.equal('File too large')
    })

    it('should return 400 - no file', async function () {
      const response = await postAttachmentNoFile(app)
      expect(response.status).to.equal(400)
      expect(response.body).to.deep.equal({ message: 'No file uploaded' })
    })
  })
})

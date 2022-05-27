const createJWKSMock = require('mock-jwks').default
const { describe, before, it, after } = require('mocha')
const { expect } = require('chai')

const { createHttpServer } = require('../../app/server')
const { postAttachment, postAttachmentNoFile, postAttachmentJSON } = require('../helper/routeHelper')
const { AUTH_ISSUER, AUTH_AUDIENCE, FILE_UPLOAD_SIZE_LIMIT_BYTES, AUTH_TYPE } = require('../../app/env')

const describeAuthOnly = AUTH_TYPE === 'JWT' ? describe : describe.skip
const describeNoAuthOnly = AUTH_TYPE === 'NONE' ? describe : describe.skip

describeAuthOnly('attachments - authenticated', function () {
  let app
  let authToken
  let jwksMock

  before(async function () {
    app = await createHttpServer()
    jwksMock = createJWKSMock(AUTH_ISSUER)
    jwksMock.start()
    authToken = jwksMock.token({
      aud: AUTH_AUDIENCE,
      iss: AUTH_ISSUER,
    })
  })

  after(async function () {
    await jwksMock.stop()
  })

  it('should return 201 - file uploaded', async function () {
    const size = 100
    const filename = 'test.pdf'
    const response = await postAttachment(app, Buffer.from('a'.repeat(size)), filename, authToken)

    expect(response.status).to.equal(201)
    expect(response.body).to.have.property('id')
    expect(response.body.filename).to.equal(filename)
    expect(response.body.size).to.equal(size)
  })

  it('should return 400 - over file size limit', async function () {
    const response = await postAttachment(app, Buffer.alloc(FILE_UPLOAD_SIZE_LIMIT_BYTES + 1), 'tooLarge.pdf')

    expect(response.status).to.equal(400)
    expect(response.error.text).to.equal('File too large')
  })

  it('should return 400 - no file', async function () {
    const response = await postAttachmentNoFile(app, authToken)
    expect(response.status).to.equal(400)
    expect(response.error.text).to.equal('Bad Request: No file uploaded')
  })

  it('should return 201 - json object uploaded', async function () {
    const attachment = { key: 'test' }
    const response = await postAttachmentJSON(app, attachment, authToken)

    expect(response.status).to.equal(201)
    expect(response.body).to.have.property('id')
    expect(response.body.filename).to.equal('json')
    expect(response.body.size).to.equal(Buffer.from(JSON.stringify(attachment)).length)
  })

  it('should return 201 - json array uploaded', async function () {
    const attachment = ['test']
    const response = await postAttachmentJSON(app, attachment, authToken)

    expect(response.status).to.equal(201)
    expect(response.body).to.have.property('id')
    expect(response.body.filename).to.equal('json')
    expect(response.body.size).to.equal(Buffer.from(JSON.stringify(attachment)).length)
  })

  it('should return 400 - json string uploaded', async function () {
    const attachment = 'test'
    const response = await postAttachmentJSON(app, attachment, authToken)

    expect(response.status).to.equal(400)
    expect(response.error.text).to.equal('Unexpected token t in JSON at position 0')
  })
})

describeNoAuthOnly('attachments - no auth', function () {
  let app

  before(async function () {
    app = await createHttpServer()
  })

  it('should return 201 - file uploaded', async function () {
    const size = 100
    const filename = 'test.pdf'
    const response = await postAttachment(app, Buffer.from('a'.repeat(size)), filename, null)

    expect(response.status).to.equal(201)
    expect(response.body).to.have.property('id')
    expect(response.body.filename).to.equal(filename)
    expect(response.body.size).to.equal(size)
  })
})

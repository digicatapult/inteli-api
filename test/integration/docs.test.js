const { describe, before, it } = require('mocha')
const jsonChai = require('chai-json')
const { expect } = require('chai').use(jsonChai)

const { createHttpServer } = require('../../app/server')
const { apiDocs } = require('../helper/routeHelper')

const fs = require('fs')
const OpenAPISchemaValidator = require('openapi-schema-validator').default

describe('api-docs', function () {
  let app

  before(async function () {
    app = await createHttpServer()
  })

  it('should return 200', async function () {
    const actualResult = await apiDocs(app)

    expect(actualResult.status).to.equal(200)
    expect(actualResult.body).to.be.a.jsonObj()

    var validator = new OpenAPISchemaValidator({
      version: 3,
      // optional
      extensions: {
        /* place any properties here to extend the schema. */
      },
    })

    const validations = validator.validate(actualResult.body)

    expect(validations.errors).to.be.empty
  })
})

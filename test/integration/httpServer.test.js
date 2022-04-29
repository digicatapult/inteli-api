const { describe, before, test } = require('mocha')
const { expect } = require('chai')

const { createHttpServer } = require('../../app/server')
const { API_VERSION } = require('../../app/env')
const { healthCheck, postRecipeRoute } = require('../helper/routeHelper')

const logger = require('../../app/logger')

describe('health', function () {
  let app

  before(async function () {
    app = await createHttpServer()
  })

  test('health check', async function () {
    const expectedResult = { status: 'ok', version: API_VERSION }

    const actualResult = await healthCheck(app)
    expect(actualResult.status).to.equal(200)
    expect(actualResult.body).to.deep.equal(expectedResult)
  })

  test('POST Recipe schema validation errors', async function () {
    logger.info('recipe test')
    const newRecipe = {
      id: 'foobar3000',
      externalId: 'foobar3000',
      name: 'foobar3000',
      imageAttachmentId: '00000000-0000-0000-0000-000000000000',
      material: 'foobar3000',
      alloy: 'foobar3000',
      price: 'foobar3000',
      requiredCerts: [{ description: 'foobar3000' }],
      supplier: 'foobar3000',
    }

    const response = await postRecipeRoute(newRecipe, app)
    expect(response.status).to.equal(400)
  })

  test('POST Recipe', async function () {
    logger.info('recipe test')
    const newRecipe = {
      id: 'foobar3000',
      externalId: 'foobar3000',
      name: 'foobar3000',
      imageAttachmentId: '00000000-0000-1000-8000-000000000000',
      material: 'foobar3000',
      alloy: 'foobar3000',
      price: 'foobar3000',
      requiredCerts: [{ description: 'foobar3000' }],
      supplier: 'foobar3000',
    }

    const response = await postRecipeRoute(newRecipe, app)
    // console.log(response.body)
    expect(response.status).to.equal(201)
  })
})

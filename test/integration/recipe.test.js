const createJWKSMock = require('mock-jwks').default
const { describe, before, it } = require('mocha')
const { expect } = require('chai')

const { createHttpServer } = require('../../app/server')
const seed = require('../seeds/recipes')
const { postRecipeRoute, getRecipeRoute } = require('../helper/routeHelper')
const { setupIdentityMock } = require('../helper/identityHelper')
const recipesFixture = require('../fixtures/recipes')
const { AUTH_ISSUER, AUTH_AUDIENCE } = require('../../app/env')

const logger = require('../../app/utils/Logger')

describe('Recipes', function () {
  describe('POST recipes', function () {
    this.timeout(15000)
    let app
    let authToken
    let jwksMock

    before(async function () {
      await seed()
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

    setupIdentityMock()

    it('should accept valid body', async function () {
      const newRecipe = {
        externalId: 'foobar3000',
        name: 'foobar3000',
        imageAttachmentId: '00000000-0000-1000-8000-000000000000',
        material: 'foobar3000',
        alloy: 'foobar3000',
        price: 'foobar3000',
        requiredCerts: [{ description: 'foobar3000' }],
        supplier: 'valid-1',
      }

      const response = await postRecipeRoute(newRecipe, app, authToken)
      expect(response.status).to.equal(201)
      const { id: responseId, ...responseRest } = response.body
      expect(responseId).to.match(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
      )
      expect(responseRest).to.deep.equal(newRecipe)
    })

    it('should cause schema validation errors', async function () {
      logger.info('recipe test')
      const newRecipe = {
        externalId: 'foobar3000',
        name: 'foobar3000',
        imageAttachmentId: '00000000-0000-0000-0000-000000000000',
        material: 'foobar3000',
        alloy: 'foobar3000',
        price: 'foobar3000',
        requiredCerts: [{ description: 'foobar3000' }],
        supplier: 'valid-1',
      }

      const response = await postRecipeRoute(newRecipe, app, authToken)
      expect(response.status).to.equal(400)
    })

    it('should accept valid body', async function () {
      const newRecipe = {
        externalId: 'foobar3000',
        name: 'foobar3000',
        imageAttachmentId: '00000000-0000-1000-8000-000000000000',
        material: 'foobar3000',
        alloy: 'foobar3000',
        price: 'foobar3000',
        requiredCerts: [{ description: 'foobar3000' }],
        supplier: 'foobar3000',
      }

      const response = await postRecipeRoute(newRecipe, app, authToken)
      expect(response.status).to.equal(201)
    })

    it('invalid attachment id returns null', async function () {
      const newRecipe = {
        externalId: 'foobar3000',
        name: 'foobar3000',
        imageAttachmentId: '00000000-0000-2000-8000-000000000000',
        material: 'foobar3000',
        alloy: 'foobar3000',
        price: 'foobar3000',
        requiredCerts: [{ description: 'foobar3000' }],
        supplier: 'valid-1',
      }

      const response = await postRecipeRoute(newRecipe, app, authToken)
      expect(response.status).to.equal(400)
      expect(response.text).to.equal('Attachment id not found')
    })

    it('invalid supplier name errors', async function () {
      const newRecipe = {
        externalId: 'foobar3000',
        name: 'foobar3000',
        imageAttachmentId: '00000000-0000-1000-8000-000000000000',
        material: 'foobar3000',
        alloy: 'foobar3000',
        price: 'foobar3000',
        requiredCerts: [{ description: 'foobar3000' }],
        supplier: 'invalid',
      }

      const response = await postRecipeRoute(newRecipe, app, authToken)
      expect(response.status).to.equal(400)
      expect(response.text).to.equal('Member "invalid" does not exist')
    })

    it('identity server error propagates', async function () {
      const newRecipe = {
        externalId: 'foobar3000',
        name: 'foobar3000',
        imageAttachmentId: '00000000-0000-1000-8000-000000000000',
        material: 'foobar3000',
        alloy: 'foobar3000',
        price: 'foobar3000',
        requiredCerts: [{ description: 'foobar3000' }],
        supplier: 'error',
      }

      const response = await postRecipeRoute(newRecipe, app, authToken)
      expect(response.status).to.equal(500)
      expect(response.text).to.equal('Internal server error')
    })
  })

  describe('GET recipes', function () {
    this.timeout(15000)
    let app
    let authToken
    let jwksMock

    before(async function () {
      await seed()
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

    setupIdentityMock()

    it('should accept valid body', async function () {
      const recipes = await Promise.all(
        recipesFixture.map(async (newRecipe) => {
          const { body: recipe } = await postRecipeRoute(newRecipe, app, authToken)
          return recipe
        })
      )

      const response = await getRecipeRoute(app, authToken)
      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('array')
      expect(response.body.length).to.equal(recipes.length)
      for (const recipe of response.body) {
        const expectation = recipes.find(({ id }) => id === recipe.id)
        expect(recipe).to.deep.equal(expectation)
      }
    })
  })
})

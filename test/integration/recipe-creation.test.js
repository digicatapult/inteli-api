const createJWKSMock = require('mock-jwks').default
const db = require('../../app/db')
const { describe, before, it } = require('mocha')
const { expect } = require('chai')

const { createHttpServer } = require('../../app/server')
const { getAllRecipeTransactions, createRecipeTransaction } = require('../helper/routeHelper')
const seed = require('../seeds/recipe-creation')
const { AUTH_ISSUER, AUTH_AUDIENCE } = require('../../app/env')

describe.only('creating a transaction', () => {
  let app
  let authToken
  let jwksMock
  let response

  before(async () => {
    await seed()
    app = await createHttpServer()
    jwksMock = createJWKSMock(AUTH_ISSUER)
    jwksMock.start()
    authToken = jwksMock.token({
      aud: AUTH_AUDIENCE,
      iss: AUTH_ISSUER,
    })
  })

  beforeEach(async () => {
    const [recipe] = await db.client('recipes').select('id')
    response = await createRecipeTransaction(app, authToken, recipe.id)
  })

  describe('if recipe data does not exist', () => {
    it('returns 404 and does not create a transaction entry', async () => {
      const { status } = await createRecipeTransaction(app, authToken, '00000000-1111-1000-8000-000000000001')

      expect(status).to.equal(404)
    })
  })

  it('creates a transaction with correct status and type', async () => {
    const {
      status,
      body: { transactionId },
    } = response
    const [transaction] = await db.client('recipe_transactions').select().where({ id: transactionId })

    expect(status).to.equal(200)
    expect(transaction).to.deep.contain({
      recipe_id: '00000000-0000-1000-8000-000000000001',
      type: 'Creation',
      status: 'Submitted',
      token_id: null,
    })
  })
})

describe('get all recipe transactions', () => {
  let app
  let authToken
  let jwksMock
  let response

  before(async () => {
    await seed()
    app = await createHttpServer()
    jwksMock = createJWKSMock(AUTH_ISSUER)
    jwksMock.start()
    authToken = jwksMock.token({
      aud: AUTH_AUDIENCE,
      iss: AUTH_ISSUER,
    })
  })

  beforeEach(async () => {
    const [recipe] = await db.client('recipes').select('id')
    response = await getAllRecipeTransactions(app, authToken, recipe.id)
  })

  after(async () => {
    await jwksMock.stop()
  })

  describe('if there are none transactions', () => {
    beforeEach(async () => {
      await db.client('recipe_transactions').del()
      const [recipe] = await db.client('recipes').select('id')
      response = await getAllRecipeTransactions(app, authToken, recipe.id)
    })

    it('returns 200 and an empty list', () => {
      const { status, body } = response
      expect(status).to.be.equal(200)
      expect(body).to.deep.equal([])
    })
  })

  describe('if recipe id is not a uuid', () => {
    it('returns 400', async () => {
      const { status } = await getAllRecipeTransactions(app, authToken, 'not-uuid')
      expect(status).to.equal(400)
    })
  })

  it('returns a list of recipe transactions', () => {
    const { status, body } = response
    expect(status).to.be.equal(200)
    expect(body.length).to.equal(2)
    expect(body[0]).to.deep.contain({
      status: 'InBlock',
      submittedAt: '2020-10-10T00:00:00.000Z',
    })
    expect(body[1]).to.deep.contain({
      status: 'Submitted',
      submittedAt: '2021-10-10T00:00:00.000Z',
    })
  })
}).timeout(5000)

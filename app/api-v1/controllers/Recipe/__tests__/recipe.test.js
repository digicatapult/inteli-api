const { expect } = require('chai')
const { stub } = require('sinon')

const Errors = require('../../../../utils/errors')
const db = require('../../../../db')
const identity = require('../../../services/identityService')
const { get } = require('..')
const { recipeExample } = require('./transaction_fixtures')

const getRecipes = async () => {
  try {
    return await get()
  } catch(err) {
    return err
  }
}

describe('recipe controller', () => {
  let stubs = {}
  let response

  beforeEach(async () => {
    stubs.getRecipes = stub(db, 'getRecipes').resolves([recipeExample])
    stubs.getMemberByAddress = stub(identity, 'getMemberByAddress')
      .onFirstCall()
      .returns({ alias: 'supplier-alias-test' })
      .onSecondCall()
      .returns({ alias: 'owner-alias-test' })
    response = await getRecipes()
  })

  afterEach(async () => {
    stubs.getRecipes.restore()
    stubs.getMemberByAddress.restore()
  })

  describe('if getRecipe method fails', () => {
    beforeEach(async () => {
      stubs.getRecipes.rejects(new Errors.InternalError({ message: 'db.getRecipes() method has failed' }))
      response = await getRecipes()
    })

    it('returns server error', () => {
      expect(response.code).to.equal(500)
      expect(response).to.be.instanceOf(Errors.InternalError)
      expect(response.message).to.equal('db.getRecipes() method has failed')
    })

    it('does noto make any calls to the identity service', () => {
      expect(stubs.getMemberByAddress.calledOnce).to.equal(false)
    })
  })

  describe('if identity service isn\'t available', () => {
    beforeEach(async () => {
      stubs.getMemberByAddress.rejects(new Errors.InternalError({ message: 'identity.getMemberByAddress() method has failed' }))
      response = await getRecipes()
    })

    it('returns server error', () => {
      expect(response.code).to.equal(500)
      expect(response).to.be.instanceOf(Errors.InternalError)
      expect(response.message).to.equal('identity.getMemberByAddress() method has failed') 
    })
  })

  it('retrieves all recipes from a local database', () => {
    expect(stubs.getRecipes.calledOnce).to.equal(true)
  })

  it('gets supplier alias from identity service', () => {
    expect(stubs.getMemberByAddress.getCall(0).args[1]).to.equal('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
  })

  it('gets owner alias from identity service', () => {
    expect(stubs.getMemberByAddress.getCall(1).args[1]).to.equal('5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY')
  })

  it('returns a formatted array of recipes', () => {
    const { status, response: body } = response

    expect(status).to.equal(200),
    expect(body).to.be.instanceOf(Array)
    expect(body).to.deep.equal([
      {
        id: '10000000-0000-1000-8000-0000000000000',
        externalId: 'TEST-externalId',
        name: 'TEST-name',
        imageAttachmentId: '00000000-0000-1000-8000-000000000000',
        material: 'TEST-material',
        alloy: 'TEST-alloy',
        price: '99.99',
        requiredCerts: [{
          'description': "TEST-certificate"
        }],
        supplier: 'supplier-alias-test',
        owner: 'owner-alias-test'
      }
    ])
  })
})

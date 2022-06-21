const { expect } = require('chai')
const { stub } = require('sinon')

const db = require('../../../../db')
const identity = require('../../../services/identityService')
const { get, getById } = require('..')
const { recipeExample } = require('./transaction_fixtures')
const { BadRequestError, NotFoundError } = require('../../../../utils/errors')

const getRecipes = async () => {
  try {
    return await get()
  } catch (err) {
    return err
  }
}

const getRecipeByID = async (req) => {
  try {
    return await getById(req)
  } catch (err) {
    return err
  }
}

describe('recipe controller', () => {
  let stubs = {}
  let response

  beforeEach(async () => {
    stubs.getRecipes = stub(db, 'getRecipes').resolves([recipeExample])
    stubs.getRecipeByIDdb = stub(db, 'getRecipeByIDdb').resolves([recipeExample])
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
    stubs.getRecipeByIDdb.restore()
  })

  describe('if getRecipe method fails', () => {
    beforeEach(async () => {
      stubs.getRecipes.rejects(new Error('db client error here'))
      response = await getRecipes()
    })

    it('returns an instance of Error generate by the db client', () => {
      expect(response).to.be.instanceOf(Error)
      expect(response.message).to.equal('db client error here')
    })

    it('does noto make any calls to the identity service', () => {
      expect(stubs.getMemberByAddress.calledOnce).to.equal(false)
    })
  })

  describe('if identity service isnt available', () => {
    beforeEach(async () => {
      stubs.getMemberByAddress.rejects(new Error('identity service error'))
      response = await getRecipes()
    })

    it('returns an instance of Error that will be generated by identity service', () => {
      expect(response).to.be.instanceOf(Error)
      expect(response.message).to.equal('identity service error')
    })
  })

  it('retrieves all recipes from a local database', () => {
    expect(stubs.getRecipes.calledOnce).to.equal(true)
  })

  it('gets supplier alias from identity service', () => {
    expect(stubs.getMemberByAddress.getCall(0).args[1]).to.equal(recipeExample.supplier)
  })

  it('gets owner alias from identity service', () => {
    expect(stubs.getMemberByAddress.getCall(1).args[1]).to.equal(recipeExample.owner)
    expect(stubs.getMemberByAddress.callCount).to.equal(2)
  })

  it('returns a formatted array of recipes', () => {
    const { status, response: body } = response
    expect(status).to.equal(200)
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
        requiredCerts: [
          {
            description: 'TEST-certificate',
          },
        ],
        supplier: 'supplier-alias-test',
        owner: 'owner-alias-test',
      },
    ])
  })

  describe('Recipe /recipe/{id}', () => {
    describe('if req.params.id is not provided', () => {
      beforeEach(async () => {
        response = await getRecipeByID({ params: {} })
      })

      it('throws a validation error', async () => {
        expect(response).to.be.an.instanceOf(BadRequestError)
        expect(response.message).to.be.equal('Bad Request: missing params')
      })

      it('does not perform any database calls', () => {
        expect(stubs.getRecipeByIDdb.calledOnce).to.equal(false)
      })
    })

    describe('if no recipes are found with a given ID', () => {
      beforeEach(async () => {
        stubs.getRecipeByIDdb.restore()
        stubs.getMemberByAddress.restore()

        stubs.getRecipeByIDdb = stub(db, 'getRecipeByIDdb').resolves([])
        stubs.getMemberByAddress = stub(identity, 'getMemberByAddress')
          .onFirstCall()
          .returns({ alias: 'supplier-alias-test' })
          .onSecondCall()
          .returns({ alias: 'owner-alias-test' })
        response = await getRecipeByID({ params: { id: '1000000-2000-7000-8000-000000000000' } })
      })

      it('throws an error', () => {
        expect(response.code).to.be.equal(404)
        expect(response).to.be.an.instanceOf(NotFoundError)
        expect(response.message).to.be.equal('Not Found: Recipe Not Found')
      })
    })

    describe('happy path - recipe', () => {
      beforeEach(async () => {
        stubs.getRecipeByIDdb.resolves([recipeExample])
        stubs.getMemberByAddress.restore()
        stubs.getMemberByAddress = stub(identity, 'getMemberByAddress')
          .onFirstCall()
          .returns({ alias: recipeExample.supplier })
          .onSecondCall()
          .returns({ alias: recipeExample.owner })
        response = await getRecipeByID({ params: { id: recipeExample.id } })
      })

      afterEach(async () => {
        stubs.getMemberByAddress.restore()
      })

      it('returns a recipe', () => {
        const { status, response: body } = response
        expect(status).to.be.equal(200)
        expect(body).to.deep.equal({
          id: '10000000-0000-1000-8000-0000000000000',
          externalId: 'TEST-externalId',
          name: 'TEST-name',
          imageAttachmentId: '00000000-0000-1000-8000-000000000000',
          material: 'TEST-material',
          alloy: 'TEST-alloy',
          price: '99.99',
          requiredCerts: [
            {
              description: 'TEST-certificate',
            },
          ],

          supplier: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
          owner: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
        })
      })
    })
  })
})
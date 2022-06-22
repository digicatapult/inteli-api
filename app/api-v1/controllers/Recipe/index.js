const { runProcess } = require('../../../utils/dscp-api')
const db = require('../../../db')
const identity = require('../../services/identityService')
const { mapRecipeData } = require('./helpers')
const { BadRequestError, NotFoundError } = require('../../../utils/errors')

module.exports = {
  get: async function (req) {
    const recipes = await db.getRecipes()
    const result = await Promise.all(
      recipes.map(async (recipe) => {
        const { alias: supplierAlias } = await identity.getMemberByAddress(req, recipe.supplier)
        const { alias: ownerAlias } = await identity.getMemberByAddress(req, recipe.owner)
        const { id, external_id, name, image_attachment_id, material, alloy, price, required_certs } = recipe

        return {
          id,
          externalId: external_id,
          name,
          imageAttachmentId: image_attachment_id,
          material,
          alloy,
          price,
          requiredCerts: required_certs,
          supplier: supplierAlias,
          owner: ownerAlias,
        }
      })
    )
    return { status: 200, response: result }
  },
  getById: async function (req) {
    const { id } = req.params
    if (!id) throw new BadRequestError('missing params')

    const [result] = await db.getRecipeByIDdb(id)
    if (!result) throw new NotFoundError('Recipe Not Found')
    const { alias: supplierAlias } = await identity.getMemberByAddress(req, result.supplier)
    const { alias: ownerAlias } = await identity.getMemberByAddress(req, result.owner)

    return {
      status: 200,
      response: {
        id: result.id,
        externalId: result.external_id,
        name: result.name,
        imageAttachmentId: result.image_attachment_id,
        material: result.material,
        alloy: result.alloy,
        price: result.price,
        requiredCerts: result.required_certs,
        supplier: supplierAlias,
        owner: ownerAlias,
      },
    }
  },
  create: async (req) => {
    if (!req.body) {
      throw new BadRequestError('no body provided')
    }

    const { address: supplierAddress } = await identity.getMemberByAlias(req, req.body.supplier)
    const selfAddress = await identity.getMemberBySelf(req)
    const { alias: selfAlias } = await identity.getMemberByAddress(req, selfAddress)

    const [attachment] = await db.getAttachment(req.body.imageAttachmentId)
    const [recipe] = await db.addRecipe({
      ...req.body,
      external_id: req.body.externalId,
      image_attachment_id: attachment.id,
      required_certs: JSON.stringify(req.body.requiredCerts),
      owner: selfAddress,
      supplier: supplierAddress,
    })

    return {
      status: 201,
      response: {
        id: recipe.id,
        owner: selfAlias,
        ...req.body,
      },
    }
  },
  transaction: {
    get: async (req) => {
      const { id } = req.params
      if (!id) throw new BadRequestError('missing params')
      const transactions = await db.getAllRecipeTransactions(id)

      return {
        status: 200,
        response: transactions.map(({ id, created_at, status }) => ({
          id,
          submittedAt: new Date(created_at).toISOString(),
          status,
        })),
      }
    },
    getById: async (req) => {
      const { creationId, id } = req.params
      if (!id || !creationId) throw new BadRequestError('missing params')

      const [transaction] = await db.getRecipeTransaction(creationId, id)
      if (!transaction) throw new NotFoundError('recipe_transactions')

      return {
        status: 200,
        creation: transaction,
      }
    },
    create: async (req) => {
      const { id } = req.params
      if (!id) throw new BadRequestError('missing params')

      const [recipe] = await db.getRecipe(id)
      if (!recipe) throw new NotFoundError('recipes')

      const transaction = await db.insertRecipeTransaction(id)
      const payload = {
        image: recipe.binary_blob,
        requiredCerts: Buffer.from(JSON.stringify(recipe.required_certs)),
        inputs: [],
        outputs: [
          {
            roles: { Owner: recipe.owner, Buyer: recipe.owner, Supplier: recipe.supplier },
            metadata: mapRecipeData({ ...recipe, transaction }),
          },
        ],
      }
      runProcess(payload, req.token)
      return {
        status: 200,
        message: `transaction ${transaction.id} has been created`,
        response: {
          id: transaction.id,
          submittedAt: new Date(transaction.created_at).toISOString(),
          status: transaction.status,
        },
      }
    },
  },
}

const logger = require('../../logger')

// eslint-disable-next-line no-unused-vars
module.exports = function (recipeService) {
  const doc = {
    GET: async function (req, res) {
      res.status(500).json({ message: 'Not Implemented' })
    },
    POST: async function (req, res) {
      logger.info('Request:', req)
      logger.child({ body: req.body }).info('body')
      if (!req.body) {
        return res.status(400).json({ message: 'Invalid request' })
      }

      const { id, externalId, name, imageAttachmentId, material, alloy, price, requiredCerts, supplier } = req.body

      logger.info('querying')
      const recipe = await recipeService.createRecipe({
        id,
        externalId,
        name,
        imageAttachmentId,
        material,
        alloy,
        price,
        requiredCerts: JSON.stringify(requiredCerts),
        supplier,
      })
      logger.info('returned')
      if (recipe == null) {
        logger.info('null')
        return res.status(200).json({ message: 'An error occurred' })
      }
      logger.info('Returning success')
      res.status(201).json(recipe)
    },
  }

  doc.GET.apiDoc = {
    summary: 'List Recipes',
    parameters: [],
    responses: {
      200: {
        description: 'Return Recipes',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Recipe',
              },
            },
          },
        },
      },
      default: {
        description: 'An error occurred',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/Error',
            },
          },
        },
      },
    },
    tags: ['recipe'],
  }

  doc.POST.apiDoc = {
    summary: 'Create Recipe',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/NewRecipe',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Recipe Created',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Recipe',
            },
          },
        },
      },
      400: {
        description: 'Invalid request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/BadRequestError',
            },
          },
        },
      },
      default: {
        description: 'An error occurred',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/Error',
            },
          },
        },
      },
    },
    tags: ['recipe'],
  }

  return doc
}

const logger = require('../../utils/Logger')
const { BadRequestError } = require('../../utils/errors')

// eslint-disable-next-line no-unused-vars
module.exports = function (recipeService) {
  const doc = {
    GET: async function (req, res) {
      res.status(500).json({ message: 'Not Implemented' })
    },
    POST: async function (req, res) {
      if (!req.body) {
        throw new BadRequestError({ message: 'No body provided uploaded', service: 'recipe' })
      }

      const { externalId, name, imageAttachmentId, material, alloy, price, requiredCerts, supplier, role } = req.body

      const recipe = await recipeService.createRecipe({
        external_id: externalId,
        role_address: role,
        name,
        image_attachment_id: imageAttachmentId,
        material,
        alloy,
        price,
        required_certs: JSON.stringify(requiredCerts),
        supplier,
      })

      logger.info('Recipe created: ', recipe.id)

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
    security: [{ bearerAuth: [] }],
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
    security: [{ bearerAuth: [] }],
    tags: ['recipe'],
  }

  return doc
}

const { transaction } = require('../../../controllers/Recipe')
const { buildValidatedJsonHandler } = require('../../../../utils/routeResponseValidator')
const { getDefaultSecurity } = require('../../../../utils/auth')

module.exports = function () {
  const doc = {
    GET: buildValidatedJsonHandler(transaction.get, {
      summary: 'List Recipe Creation Actions',
      description: 'Returns the details of all on-chain transactions to create the recipe {id}.',
      parameters: [
        {
          description: 'Id of the recipe',
          in: 'path',
          required: true,
          name: 'id',
          allowEmptyValue: false,
          schema: {
            $ref: '#/components/schemas/ObjectReference',
          },
        },
      ],
      responses: {
        200: {
          description: 'Return Recipe Creation Actions',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/RecipeCreation',
                },
              },
            },
          },
        },
        404: {
          description: 'Recipe not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotFoundError',
              },
            },
          },
        },
      },
      tags: ['recipe'],
    }),
    POST: buildValidatedJsonHandler(transaction.create, {
      summary: 'Create Recipe Creation Action',
      description: 'A buyer creates the recipe {id}. Recipe is now viewable to other members',
      parameters: [
        {
          description: 'Id of the recipe',
          in: 'path',
          required: true,
          name: 'id',
          allowEmptyValue: false,
          schema: {
            $ref: '#/components/schemas/ObjectReference',
          },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/NewRecipeCreation',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Recipe Creation Created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RecipeCreation',
              },
            },
          },
        },
        400: {
          description: 'Invalid request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BadRequestError',
              },
            },
          },
        },
      },
      security: getDefaultSecurity(),
      tags: ['recipe'],
    }),
  }

  return doc
}

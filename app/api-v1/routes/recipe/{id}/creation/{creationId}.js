const { transaction } = require('../../../../controllers/Recipe')
const { getDefaultSecurity } = require('../../../../../utils/auth')
const { buildValidatedJsonHandler } = require('../../../../../utils/routeResponseValidator')

// eslint-disable-next-line no-unused-vars
module.exports = function (recipeService) {
  const doc = {
    GET: buildValidatedJsonHandler(
      async function (req) {
        const { status, ...body } = await transaction.get(req)
        return { status, response: body }
      },
      {
        summary: 'Get Recipe Creation Action',
        description: 'Returns the details of the on-chain transaction {creationId} to create the recipe {id}.',
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
          {
            description: 'Id of the recipe creation action',
            in: 'path',
            required: true,
            name: 'creationId',
            allowEmptyValue: false,
            schema: {
              $ref: '#/components/schemas/ObjectReference',
            },
          },
        ],
        responses: {
          200: {
            description: 'Return Recipe Creation Action',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RecipeCreation',
                },
              },
            },
          },
          404: {
            description: 'Recipe Creation Action not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NotFoundError',
                },
              },
            },
          },
        },
        security: getDefaultSecurity(),
        tags: ['recipe'],
      }
    ),
  }

  return doc
}

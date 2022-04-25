// eslint-disable-next-line no-unused-vars
module.exports = function (catalogueService) {
  const doc = {
    GET: async function (req, res) {
      res.status(500).json({ message: 'Not Implemented' })
    },
    POST: async function (req, res) {
      res.status(500).json({ message: 'Not Implemented' })
    },
  }

  doc.GET.apiDoc = {
    summary: 'List Catalogue Items',
    parameters: [
      {
        description:
          'Filter by owner of the catalogue item. Behaviour defaults to the current organisation. Does not return partial matches',
        in: 'query',
        required: false,
        name: 'owner',
        allowEmptyValue: false,
      },
      {
        description: "Filter by the item's external ID. Returns partial matches",
        in: 'query',
        required: false,
        name: 'partId',
        allowEmptyValue: false,
      },
      {
        description: 'Filter by item name. Returns partial matches',
        in: 'query',
        required: false,
        name: 'partId',
        allowEmptyValue: false,
      },
    ],
    responses: {
      200: {
        description: 'Return Catalogue Items',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CatalogueItem',
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
    tags: ['catalogue-item'],
  }

  doc.POST.apiDoc = {
    summary: 'Create Catalogue Item',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/NewCatalogueItem',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Create Catalogue Item',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CatalogueItem',
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
    tags: ['catalogue-item'],
  }

  return doc
}

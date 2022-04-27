// eslint-disable-next-line no-unused-vars
module.exports = function (buildService) {
  const doc = {
    GET: async function (req, res) {
      res.status(500).json({ message: 'Not Implemented' })
    },
    POST: async function (req, res) {
      res.status(500).json({ message: 'Not Implemented' })
    },
  }

  doc.GET.apiDoc = {
    summary: 'List Build Start Actions',
    parameters: [
      {
        description: 'Id of the build',
        in: 'path',
        required: true,
        name: 'id',
        allowEmptyValue: false,
      },
    ],
    responses: {
      200: {
        description: 'Return Build Start Actions',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/BuildStart',
              },
            },
          },
        },
      },
      404: {
        description: 'Build not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/NotFoundError',
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
    tags: ['build'],
  }

  doc.POST.apiDoc = {
    summary: 'Create Build Start Action',
    parameters: [
      {
        description: 'Id of the build. Must not have started (startedAt == null)',
        in: 'path',
        required: true,
        name: 'id',
        allowEmptyValue: false,
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/NewBuildStart',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Build Start Action Created',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BuildStart',
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
    tags: ['build'],
  }

  return doc
}

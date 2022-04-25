const { PORT, API_VERSION, API_MAJOR_VERSION } = require('../env')

const apiDoc = {
  openapi: '3.0.3',
  info: {
    title: 'ApiService',
    version: API_VERSION,
  },
  servers: [
    {
      url: `http://localhost:${PORT}/${API_MAJOR_VERSION}`,
    },
  ],
  components: {
    responses: {
      NotFoundError: {
        description: 'This resource cannot be found',
      },
      BadRequestError: {
        description: 'The request is invalid',
      },
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
      },
      Error: {
        description: 'An error occurred',
      },
    },
    schemas: {
      NewCatalogueItem: {
        type: 'object',
        properties: {
          externalId: {
            description: 'id of the catalogue-item in an external ERP',
            allOf: [{ $ref: '#/components/schemas/OnChainLiteral' }],
          },
          name: {
            description: 'Name of the catalogue-item',
            allOf: [{ $ref: '#/components/schemas/OnChainLiteral' }],
          },
          image: {
            description: 'Example image of the item',
            allOf: [{ $ref: '#/components/schemas/ObjectReference' }],
          },
          material: {
            description: 'Primary material of the constructed catalogue-item',
            allOf: [{ $ref: '#/components/schemas/OnChainLiteral' }],
          },
          alloy: {
            description: 'Primary alloy present in the constructed catalogue-item',
            allOf: [{ $ref: '#/components/schemas/OnChainLiteral' }],
          },
          price: {
            description: 'Price of the catalogue-item. This information is not stored on-chain.',
            type: 'string',
          },
          requiredCerts: {
            description: 'Certification requirements ',
            type: 'array',
            items: {
              $ref: '#/components/schemas/CertificationRequirement',
            },
          },
          supplier: {
            description:
              'Name of the supplier who is contracted to build the catalogue-item. This information is not stored on-chain',
            type: 'string',
            maxLength: 255,
          },
        },
        required: ['externalId', 'name', 'image', 'material', 'alloy', 'price', 'requiredCerts', 'supplier'],
      },
      CatalogueItem: {
        type: 'object',
        allOf: [{ $ref: '#/components/schemas/NewCatalogueItem' }],
        properties: {
          id: {
            description: 'local id of the catalogue-item',
            type: 'string',
          },
        },
        required: ['id', 'externalId', 'name', 'image', 'material', 'alloy', 'price', 'requiredCerts', 'supplier'],
      },
      CertificationRequirement: {
        type: 'object',
        properties: {
          description: {
            description: 'Description of the certification requirement',
            allOf: [{ $ref: '#/components/schemas/OnChainLiteral' }],
          },
        },
      },
      OnChainLiteral: {
        type: 'string',
        description: 'A literal which will be represented as on-chain metadata',
        maxLength: 32,
      },
      ObjectReference: {
        type: 'string',
        description: 'Object references are an internal UUID used to locally identify objects in the system',
        minLength: 36,
        maxLength: 36,
        pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$',
      },
      AttachmentEntry: {
        type: 'object',
        description: 'An attachment that can be referenced when creating entries',
        properties: {
          id: {
            $ref: '#/components/schemas/ObjectReference',
          },
          name: {
            description: 'Name of the file uploaded as an attachment',
            type: 'string',
            maxLength: 255,
            minLength: 1,
          },
          size: {
            description: 'size of the uploaded attachment',
            type: 'integer',
            minimum: 1,
          },
        },
      },
    },
    securitySchemes: {},
  },
  paths: {},
}

module.exports = apiDoc

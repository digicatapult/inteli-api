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
              'Name of the supplier who is contracted to build the catalogue-item. This information is not stored directly on-chain',
            type: 'string',
            maxLength: 255,
          },
        },
      },
      CatalogueItem: {
        type: 'object',
        allOf: [{ $ref: '#/components/schemas/NewCatalogueItem' }],
        properties: {
          id: {
            description: 'local id of the catalogue-item',
            allOf: [{ $ref: '#/components/schemas/ObjectReference' }],
          },
          owner: {
            description:
              'Name of the OEM who owns the design of the catalogue-item. This information is not stored directly on-chain',
            type: 'string',
            maxLength: 255,
          },
        },
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
      NewBuild: {
        type: 'object',
        description: 'A manufacture run that produces parts',
        properties: {
          externalId: {
            description: 'id of the build in an external system',
            allOf: [{ $ref: '#/components/schemas/OnChainLiteral' }],
          },
          parts: {
            description: 'Parts created by this build ',
            type: 'array',
            items: {
              $ref: '#/components/schemas/NewPart',
            },
          },
          completionEstimate: {
            description: 'Date and time at which the build is estimated to finish',
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Build: {
        type: 'object',
        properties: {
          id: {
            description: 'local id of the build',
            type: 'string',
          },
          externalId: {
            description: 'id of the build in an external system',
            allOf: [{ $ref: '#/components/schemas/OnChainLiteral' }],
          },
          partIds: {
            description: 'Parts created by this build ',
            type: 'array',
            items: {
              description: 'id of a part constructed in this build',
              allOf: [{ $ref: '#/components/schemas/ObjectReference' }],
            },
          },
          manufacturer: {
            description: 'Name of the manufacturer who ran the build. This information is not stored directly on-chain',
            type: 'string',
            maxLength: 255,
          },
          completionEstimatedAt: {
            description: 'Date and time at which the build is estimated to finish',
            type: 'string',
            format: 'date-time',
          },
          startedAt: {
            description: 'Date and time on which the build started. Null if not started',
            type: 'string',
            format: 'date-time',
            nullable: true,
          },
          completedAt: {
            description: 'Date and time at which the build completed. Null if not completed',
            type: 'string',
            format: 'date-time',
            nullable: true,
          },
        },
      },
      NewPart: {
        type: 'object',
        description: 'Part to be created',
        properties: {
          catalogueItemId: {
            description: 'id of the catalogue-item that describes the design of this part',
            allOf: [{ $ref: '#/components/schemas/ObjectReference' }],
          },
          orderId: {
            description: 'local id of the order the part is assigned to',
            type: 'string',
            allOf: [{ $ref: '#/components/schemas/ObjectReference' }],
            nullable: true,
          },
        },
      },
      Part: {
        type: 'object',
        description: 'A part being or having been manufactured',
        allOf: [{ $ref: '#/components/schemas/NewPart' }],
        properties: {
          id: {
            description: 'local id of the part',
            allOf: [{ $ref: '#/components/schemas/ObjectReference' }],
          },
          buildId: {
            description: 'id of the build that produces/produced this part',
            allOf: [{ $ref: '#/components/schemas/ObjectReference' }],
          },
          manufacturer: {
            description:
              'Name of the manufacturer who created the part. This information is not stored directly on-chain',
            type: 'string',
            maxLength: 255,
          },
        },
      },
      NewOrder: {
        type: 'object',
        description: 'A new purchase-order to be submitted',
        properties: {
          manufacturer: {
            description:
              'Name of the manufacturer who will supply parts from this purchase-order. This information is not stored directly on-chain',
            type: 'string',
            maxLength: 255,
          },
          requiredBy: {
            description: 'Date and time at which the purchase-order must be completed',
            type: 'string',
            format: 'date-time',
          },
          items: {
            type: 'array',
            description: 'List of parts to be supplied',
            items: {
              description: 'id of the catalogue-item to be built',
              allOf: [{ $ref: '#/components/schemas/ObjectReference' }],
            },
          },
        },
      },
      Order: {
        description: 'A purchase-order',
        allOf: [{ $ref: '#/components/schemas/NewOrder' }],
        properties: {
          id: {
            description: 'local id of the purchase-order',
            allOf: [{ $ref: '#/components/schemas/ObjectReference' }],
          },
          owner: {
            description:
              'Name of the submitter of the purchase-order. This information is not stored directly on-chain',
            type: 'string',
            maxLength: 255,
          },
        },
      },
    },
    securitySchemes: {},
  },
  paths: {},
}

// make all schema properties required
Object.values(apiDoc.components.schemas).forEach((schemaObj) => {
  if (schemaObj.type === 'object') {
    schemaObj.required = Object.keys(schemaObj.properties)
  }
})

module.exports = apiDoc

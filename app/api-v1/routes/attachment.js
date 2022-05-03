const logger = require('../../logger')
const { handleErrors, FileUploadError } = require('../../utils/errors')

module.exports = function (attachmentService) {
  const doc = {
    GET: async function (req, res) {
      res.status(500).json({ message: 'Not Implemented' })
    },
    POST: handleErrors(async function (req, res) {
      logger.info('Attachment upload: ', req.file)

      if (!req.file) {
        throw new FileUploadError({ code: 400, message: 'No file uploaded', service: 'attachment' })
      }

      const attachment = await attachmentService.createAttachment(req.file)
      const result = attachment[0]
      res.status(201).json({ ...result, size: req.file.size })
    }),
  }

  doc.GET.apiDoc = {
    summary: 'List attachments',
    parameters: [],
    responses: {
      200: {
        description: 'Return attachment list',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/AttachmentEntry',
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
    tags: ['attachment'],
  }

  doc.POST.apiDoc = {
    summary: 'Create Attachment',
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Attachment Created',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AttachmentEntry',
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
    tags: ['attachment'],
  }

  return doc
}

const req = require('express/lib/request')
const { getAttachment, addRecipe } = require('../../db')
const { BadRequestError } = require('../../utils/errors')

async function createRecipe(reqBody) {
  if (!reqBody) {
    throw BadRequestError({ message: 'Invalid recipe input' })
  }

  const { attachmentId } = reqBody

  const attachment = getAttachment(attachmentId)
  if (!attachment) {
    throw BadRequestError({ message: 'Attachment id not found', service: 'recipe' })
  }

  const recipe = await addRecipe(reqBody)
  return recipe
}

module.exports = {
  createRecipe,
}

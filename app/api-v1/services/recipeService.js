const req = require('express/lib/request')
const { getAttachment, addRecipe } = require('../../db')
const { ReceipeError } = require('../utils')

async function createRecipe(reqBody) {
  if (!reqBody) {
    return null
  }

  const { attachmentId } = reqBody

  const attachment = getAttachment(attachmentId)
  if (!attachment) {
    throw new ReceipeError({
      code: 400,
      message: 'bad attachment id',
      operation: 'create',
    })
  }

  const recipe = await addRecipe(reqBody)
  return recipe
}

module.exports = {
  createRecipe,
}

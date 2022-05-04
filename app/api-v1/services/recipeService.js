const req = require('express/lib/request')
const { getAttachment, addRecipe } = require('../../db')

async function createRecipe(reqBody) {
  if (!reqBody) {
    return null
  }

  const { attachmentId } = reqBody

  try {
    const attachment = await getAttachment(attachmentId)
  } catch (err) {
    console.log(err)
  }
  if (!attachment) {
    return null
  }

  const recipe = await addRecipe(reqBody)
  return recipe
}

module.exports = {
  createRecipe,
}

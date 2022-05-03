const req = require('express/lib/request')
const { addRecipe } = require('../../db')

async function createRecipe(reqBody) {
  if (!reqBody) {
    return null
  }

  const { attachmentId } = reqBody
  const recipe = await addRecipe(reqBody)
  return recipe
}

module.exports = {
  createRecipe,
}

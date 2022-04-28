const { addRecipe } = require('../../db')

async function createRecipe(reqBody) {
  if (!reqBody) {
    return { statusCode: 400, result: {} }
  }

  const recipe = await addRecipe(reqBody)

  return recipe

module.exports = {
    createRecipe
}

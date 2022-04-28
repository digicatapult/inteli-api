const { addRecipe } = require('../../db')

async function createRecipe(reqBody) {
  if (!reqBody) {
    return null
  }

  const recipe = await addRecipe(reqBody)

  return recipe
}

module.exports = {
  createRecipe,
}

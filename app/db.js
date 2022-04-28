const knex = require('knex')

const env = require('./env')

const client = knex({
  client: 'pg',
  migrations: {
    tableName: 'migrations',
  },
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
})

async function addRecipe(recipe) {
  return client('recipes')
    .insert(recipe)
    .returning(['id', 'externalId', 'name', 'imageAttachmentId', 'material', 'alloy', 'price', 'supplier'])
}

module.exports = {
  client,
  addRecipe,
}

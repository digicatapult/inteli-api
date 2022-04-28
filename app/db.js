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

module.exports = {
  client,
}

async function addRecipe(reqBody) {
  return client('recipes')
    .insert(reqBody)
    .returning(['id', 'externalId', 'name', 'imageAttachmentId', 'material', 'alloy', 'price'])
}

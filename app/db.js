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

async function findRecipes({ type, ingest, ingestId }) {
  let query = client('Recipes AS t').select(['t.id AS id', 't.type AS type', 't.metadata AS metadata']).orderBy('t.id')

  if (type) query = query.where({ type })
  if (ingest || ingestId) {
    query = query.join('ingest_Recipes AS ti', 'ti.Recipe_id', '=', 't.id')
    if (ingest) {
      query = query.where({ 'ti.ingest': ingest })
    }
    if (ingestId) {
      query = query.where({ 'ti.ingest_id': ingestId })
    }
  }

  return query
}

async function findRecipeById({ id }) {
  return client('Recipes').select(['id', 'type', 'metadata']).where({ id })
}

async function addRecipe(reqBody) {
  return client('Recipes').insert(reqBody).returning(['id', 'type', 'metadata'])
}

async function updateRecipe({ id, type, metadata }) {
  return client('Recipes').update({ type, metadata, updated_at: new Date() }, ['id', 'type', 'metadata']).where({ id })
}

async function removeRecipe({ id }) {
  await client('Recipes').del().where({ id })
}

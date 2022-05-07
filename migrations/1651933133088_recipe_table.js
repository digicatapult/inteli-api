exports.up = async (knex) => {
  const uuidGenerateV4 = () => knex.raw('uuid_generate_v4()')
  const now = () => knex.fn.now()

  await knex.schema.createTable('recipe', (def) => {
    def.uuid('id').defaultTo(uuidGenerateV4())
    def.json('metadata').notNullable() // TODO - confirm
    def.datetime('created_at').notNullable().default(now())
    def.primary(['id'])
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTable('recipe')
  await knex.raw('DROP EXTENSION "uuid-ossp"')
}

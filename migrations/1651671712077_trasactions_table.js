exports.up = async (knex) => {
  const uuidGenerateV4 = () => knex.raw('uuid_generate_v4()')
  const now = () => knex.fn.now()

  await knex.schema.createTable('transactions', (def) => {
    def.uuid('id').defaultTo(uuidGenerateV4())
    def.string('type').notNullable()
    def.number('token_id').notNullable()
    def.uuid('recipe_id').notNullable()
    def.enu('status', [ 'submitted', 'minted'])
    def.datetime('created_at').notNullable().default(now())
    def.primary(['id'])
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTable('transactions')
  await knex.raw('DROP EXTENSION "uuid-ossp"')
}

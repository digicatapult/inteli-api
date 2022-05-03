exports.up = async (knex) => {
  // check extension is not installed
  const [extInstalled] = await knex('pg_extension').select('*').where({ extname: 'uuid-ossp' })

  if (!extInstalled) {
    await knex.raw('CREATE EXTENSION "uuid-ossp"')
  }

  const uuidGenerateV4 = () => knex.raw('uuid_generate_v4()')
  const now = () => knex.fn.now()

  await knex.schema.createTable('attachments', (def) => {
    def.uuid('id').defaultTo(uuidGenerateV4())
    def.string('filename', 50).notNullable()
    def.binary('binary_blob').notNullable()
    def.datetime('created_at').notNullable().default(now())

    def.primary(['id'])
  })

  await knex.schema.createTable('orders', (def) => {
    def.uuid('id').defaultTo(uuidGenerateV4())
    def.string('owner', 255).notNullable()
    def.string('manufacturer', 255).notNullable()
    //def.enu('status', ['Created', 'Submitted', 'Rejected', 'Amended', 'Accepted']).notNullable()
    def.string('status', 255).notNullable()
    def.jsonb('items').notNullable()
    def.datetime('required_by').notNullable()
    def.datetime('created_at').notNullable().default(now())
    def.datetime('updated_at').notNullable().default(now())
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTable('attachments')
  await knex.schema.dropTable('orders')
  await knex.raw('DROP EXTENSION "uuid-ossp"')
}

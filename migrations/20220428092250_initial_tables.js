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

  await knex.schema.createTable('recipe', (def) => {
    def.uuid('id').defaultTo(uuidGenerateV4())

    def.datetime('created_at').notNullable().default(now())
    def.datetime('updated_at').notNullable().default(now())
    def.string('externalId')
    def.string('name')
    def.string('imageAttachmentId')
    def.string('material')
    def.string('alloy')
    def.string('price')
    def.jsonb('requiredCerts') // TODO
    def.string('supplier')

    def.primary(['id'])
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTable('attachments')
  await knex.raw('DROP EXTENSION "uuid-ossp"')
}

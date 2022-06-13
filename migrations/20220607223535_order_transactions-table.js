/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const uuidGenerateV4 = () => knex.raw('uuid_generate_v4()')
  const now = () => knex.fn.now()

  await knex.schema.createTable('order_transactions', (def) => {
    def.uuid('id').defaultTo(uuidGenerateV4())
    def.integer('token_id')
    def.uuid('order_id').notNullable()
    def
      .enu('type', ['Submission', 'Rejection', 'Acceptance', 'Amendment'], {
        enumName: 'order_type',
        useNative: true,
      })
      .notNullable()
    def.enu('status', ['Created', 'Submitted', 'Rejected', 'Amended', 'Accepted'], {
      enumName: 'tx_status',
      existingType: true,
      useNative: true,
    })
    def.datetime('created_at').notNullable().default(now())
    def.datetime('updated_at').notNullable().default(now())

    def.primary(['id'])
    def.foreign('order_id').references('id').on('orders')
  })


  await knex.schema.alterTable('orders', (def) => {
    def.primary(['id'])
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('order_transactions')
}

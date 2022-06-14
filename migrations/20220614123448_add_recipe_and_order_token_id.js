/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.alterTable('recipes', (def) => {
    def.integer('token_id')
  })

  await knex.schema.alterTable('orders', (def) => {
    def.integer('token_id')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.alterTable('recipes', (def) => {
    def.dropColumn('token_id')
  })

  await knex.schema.alterTable('orders', (def) => {
    def.dropColumn('token_id')
  })
}

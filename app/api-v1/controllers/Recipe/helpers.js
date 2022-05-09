const mapRecipeData = (data) => ({
  name: { type: 'LITERAL', value: data.name },
  material: { type: 'LITERAL', value: data.material },
  alloy: { type: 'LITERAL', value: data.alloy },
  price: { type: 'LITERAL', value: data.price },
  requiredCerts: { type: 'LITERAL', value: data.requiredCerts },
  supplier: { type: 'LITERAL', value: data.supplier },
})

/*
    def.string('externalId').notNullable()
    def.string('name').notNullable()
    def.uuid('imageAttachmentId').notNullable()
    def.string('material').notNullable()
    def.string('alloy').notNullable()
    def.string('price').notNullable()
    def.json('requiredCerts').notNullable()
    def.string('supplier').notNullable()
*/

module.exports = {
  mapRecipeData
}
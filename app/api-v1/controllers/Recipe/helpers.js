const mapRecipeData = (data) => ({
  externalId: { type: 'LITERAL', value: data.external_id },
  name: { type: 'LITERAL', value: data.name },
  material: { type: 'LITERAL', value: data.material },
  alloy: { type: 'LITERAL', value: data.alloy },
  requiredCerts: { type: 'FILE', value: data.required_certs },
  image: { type: 'FILE', value: data.filename },
})

module.exports = {
  mapRecipeData,
}

exports.mapRecipeData = (data) => ({
  externalId: { type: 'LITERAL', value: data.external_id },
  name: { type: 'LITERAL', value: data.name },
  material: { type: 'LITERAL', value: data.material },
  alloy: { type: 'LITERAL', value: data.alloy },
  requiredCerts: { type: 'FILE', value: 'required_certs.json' },
  image: { type: 'FILE', value: data.filename },
})

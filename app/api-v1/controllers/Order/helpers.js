// TODO some helpers could be abstracted into a general place
exports.mapOrderData = (data) => {
  const recipes = data.recipes.reduce(({ id }, output) => {
    if (!id) return output
    return output[id] = { type: 'TOKEN_ID', value: id }
  }, {})

  return {
    type: { type: 'LITERAL', value: 'ORDER' },
    status: { type: 'LITERAL', value: data.status },
    requiredBy: { type: 'LITERAL', value: data.requiredBy },
    transactionId: { type: 'LITERAL', value: data.transaction.id },
    ...recipes,
  }
}

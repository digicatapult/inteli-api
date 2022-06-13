exports.mapOrderData = async (data) => {
  // TODO check local db to confirm that all recipes has a token_id
  // if not return something

  const recipes = data.items.reduce((id, output) => {
    if (id) {
      output[id] = {
        type: 'TOKEN_ID',
        value: id,
      }
    }

    return output
  }, {})

  return {
    type: { type: 'LITERAL', value: 'ORDER' },
    status: { type: 'LITERAL', value: data.status },
    requiredBy: { type: 'LITERAL', value: data.requiredBy },
    transactionId: { type: 'LITERAL', value: data.transaction.id },
    ...recipes,
  }
}

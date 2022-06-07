exports.mapOrderData = (data) => ({
  type: { type: 'LITERAL', value: data.type },
  status: { type: 'LITERAL', value: data.status },
  orderReference: { type: 'LITERAL', value: data.orderReference },
  partId: { type: 'LITERAL', value: data.partId },
  name: { type: 'LITERAL', value: data.name },
  material: { type: 'LITERAL', value: data.material },
  alloy: { type: 'LITERAL', value: data.alloy },
  price: { type: 'LITERAL', value: data.price },
  quantity: { type: 'LITERAL', value: data.quantity },
  deliveryBy: { type: 'LITERAL', value: data.deliveryBy },
  orderImage: { type: 'FILE', value: data.orderImage.fileName },
  requiredCerts: { type: 'FILE', value: data.requiredCerts.fileName },
})

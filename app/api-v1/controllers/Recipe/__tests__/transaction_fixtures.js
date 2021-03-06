module.exports = {
  recipeId: '09000000-0000-1000-8000-000000000000',
  recipeExample: {
    id: '10000000-0000-1000-8000-0000000000000',
    created_at: '2022-05-22T11:04:29.316Z',
    updated_at: '2022-05-22T11:04:29.316Z',
    external_id: 'TEST-externalId',
    name: 'TEST-name',
    image_attachment_id: '00000000-0000-1000-8000-000000000000',
    material: 'TEST-material',
    alloy: 'TEST-alloy',
    price: '99.99',
    required_certs: [{ description: 'TEST-certificate' }],
    supplier: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    owner: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
    filename: 'foo.jpg',
    binary_blob: Buffer.from(['test']),
  },
  transactionsExample: [
    {
      id: '00000000-1000-1000-8000-0000000000000',
      recipe_id: '10000000-0000-1000-8000-0000000000000',
      latest_token_id: 2,
      status: 'Accepted',
      created_at: '2022-05-22T08:04:29.316Z',
      updated_at: '2022-05-22T08:04:29.316Z',
      type: 'Creation',
    },
    {
      id: '00000000-2000-1000-8000-0000000000000',
      recipe_id: '10000000-0000-1000-8000-0000000000000',
      latest_token_id: 1,
      status: 'Accepted',
      created_at: '2022-05-23T11:00:29.316Z',
      updated_at: '2022-05-22T11:04:29.316Z',
      type: 'Creation',
    },
  ],
  listResponse: [
    {
      id: '00000000-1000-1000-8000-0000000000000',
      status: 'Accepted',
      submittedAt: '2022-05-22T08:04:29.316Z',
    },
    {
      id: '00000000-2000-1000-8000-0000000000000',
      status: 'Accepted',
      submittedAt: '2022-05-23T11:00:29.316Z',
    },
  ],
}

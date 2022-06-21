const { client } = require('../../app/db')

const cleanup = async () => {
  await client('orders').del()
  await client('recipes').del()
  await client('attachments').del()
}

const seed = async () => {
  await cleanup()

  await client('attachments').insert([
    {
      id: '00000000-0000-1000-8000-000000000000',
      filename: 'foo.jpg',
      binary_blob: 9999999,
    },
  ])

  await client('recipes').insert([
    {
      id: '36345f4f-0000-42e2-83f9-79e2e195e000',
      external_id: '045240',
      name: 'Magical Part 1',
      image_attachment_id: '00000000-0000-1000-8000-000000000000',
      material: 'material',
      alloy: 'alloy',
      latest_token_id: 10,
      price: '999.66',
      required_certs: JSON.stringify([{ description: 'foobar3000' }]),
      supplier: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      owner: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
    },
  ])

  await client('recipes').insert([
    {
      id: '36345f4f-0000-42e2-83f9-79e2e195e001',
      external_id: 'supplier3000',
      name: 'Mystical Part 1',
      image_attachment_id: '00000000-0000-1000-8000-000000000000',
      material: 'material',
      alloy: 'alloy',
      latest_token_id: null,
      price: '1000',
      required_certs: JSON.stringify([{ description: 'supplier3000' }]),
      supplier: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      owner: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
    },
  ])

  // with reciope that does not have a token_id
  await client('orders').insert([
    {
      id: '36345f4f-6535-42e2-83f9-79e2e195e111',
      supplier: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      items: ['10000000-0000-1000-9000-000000000000'],
      purchaser: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
      status: 'Created',
      required_by: '2022-10-21T11:45:46.919Z',
    },
  ])

  // with reciope that has a token_id
  await client('orders').insert([
    {
      id: '36345f4f-6535-42e2-83f9-79e2e195e112',
      supplier: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      items: ['10000000-0000-1000-8000-000000000000'],
      purchaser: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
      status: 'Created',
      required_by: '2022-10-21T11:45:46.919Z',
    },
  ])
}

module.exports = {
  cleanup,
  seed,
}

const { client } = require('../../app/db')

const cleanup = async () => {
  await client('recipes').del()
  await client('attachments').del()
}

const attachmentId = '00000000-0000-1000-8000-000000000000'

module.exports = async () => {
  await cleanup() // no need to export, it call it anyway...

  await client('attachments').insert([
    {
      id: attachmentId,
      filename: 'foo.jpg',
      binary_blob: 9999999,
    },
  ])
  await client('recipes').insert({
    id: '00000000-0000-1000-8000-000000000001',
    external_id: 'TEST-externalId',
    role_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutAA',
    name: 'TEST-name',
    image_attachment_id: attachmentId,
    material: 'TEST-material',
    alloy: 'TEST-alloy',
    price: '99.99',
    required_certs: JSON.stringify([{ description: 'TEST-certificate' }]),
    supplier: 'TEST-supplier',
  })
}

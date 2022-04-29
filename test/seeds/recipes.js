const { client } = require('../../app/db')

const cleanup = async () => {
  await client('recipes').del()
  await client('attachments').del()
}

const seed = async () => {
  await cleanup()

  // create thing types
  await client('attachments').insert([
    {
      id: '00000000-0000-1000-8000-000000000000',
      filename: 'foo.jpg',
    },
  ])
}

module.exports = {
  cleanup,
  seed,
}

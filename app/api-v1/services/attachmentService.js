const fs = require('fs')
const { insertAttachment } = require('../../db')

const createAttachment = async (file) => {
  return new Promise((resolve) => {
    fs.readFile(file.path, async (err, data) => {
      if (err) throw err
      const attachment = await insertAttachment(file.originalname, data)
      resolve(attachment)
    })
  })
}

module.exports = {
  createAttachment,
}

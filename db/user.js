const mongoose = require('mongoose')
const portSchema = new mongoose.Schema({
      name: {
            type: String,
            require: true
      },
      email: {
            type: String,
            require: true
      },
    message: {
            type: String
      }
})
const PortC = mongoose.model("Portcontacts", portSchema)
module.exports = PortC
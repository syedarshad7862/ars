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
      },
      postAt: {
            type: Date,
            default: Date.now
      }
})
const PortC = mongoose.model("Portcontacts", portSchema)
module.exports = PortC
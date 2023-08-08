const mongoose = require('mongoose')

const blogSchema= new mongoose.Schema({
      blog_title: {
            type: String,
            require: true
      },
      blog_body: {
            type: String,
            require: true
      },
      createAt: {
            type: Date,
            default: Date.now
      },
      updatedAt: {
            type: Date,
            default: Date.now
      }
})

const blogPost = mongoose.model("blogPost", blogSchema)
module.exports = blogPost
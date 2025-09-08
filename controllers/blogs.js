const blogRouter = require('express').Router()
const Blog = require('../models/blogs')

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogRouter.post('/', (request, response) => {
  if (!request.body?.title || !request.body?.url) {
    response.status(400).end()
  } else {
    if (!request.body?.likes) {
      request.body.likes = 0
    }

    const blog = new Blog(request.body)
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  }
})

module.exports = blogRouter
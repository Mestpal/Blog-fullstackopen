const blogRouter = require('express').Router()
const Blog = require('../models/blogs')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

blogRouter.post('/', async(request, response) => {
  if (!request.body?.title || !request.body?.url) {
    response.status(400).end()
  } else {
    if (!request.body?.likes) {
      request.body.likes = 0
    }

    const blog = new Blog(request.body)
    const result = await blog.save()

    response.status(201).json(result)
  }
})

blogRouter.delete('/:id', async(request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async(request, response) => {
  if (!request.body?.title || !request.body?.url) {
    response.status(400).end()
  } else {
    if (!request.body?.likes) {
      request.body.likes = 0
    }

    const update = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
    response.json(update)
  }
})

module.exports = blogRouter
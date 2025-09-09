const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs)
})

blogRouter.post('/', async(request, response) => {
  if (!request.body?.title || !request.body?.url) {
    response.status(400).end()
  } else {
    if (!request.body?.likes) {
      request.body.likes = 0
    }

    const users = await User.find({})
    const user = users[0]

    let newBlog = {
      ...request.body,
      user: user.id
    }
    const blog = new Blog(newBlog)
    const savedBlog = await blog.save()

    user.blogs = user.blogs.length
      ? user.blogs.concat(savedBlog.id)
      : [savedBlog.id]
    user.save()

    response.status(201).json(savedBlog)
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
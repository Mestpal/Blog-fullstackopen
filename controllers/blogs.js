const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')

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
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    if (!body?.likes) {
      body.likes = 0
    }

    const user= await User.findById(decodedToken.id)
    let newBlog = {
      ...body,
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
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const blogId = request.params.id

  if (decodedToken) {
    const blog = await Blog.findById(blogId)

    if ( blog?.user?.toString() === decodedToken.id ){
      await Blog.findByIdAndDelete(blogId)
      response.status(204).end()
    } else {
      response.status(400).send({ error: 'Blog not found or already deleted' })
    }
  } else {
    response.status(401).send({ error: 'Invalid token' })
  }

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
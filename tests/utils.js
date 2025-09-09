
const app = require('../App')
const supertest = require('supertest')
const api = supertest(app)

const getBlogs = async() => {
  return await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}

const createBlog = async(blog) => {
  return await api
    .post ('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
}

const create400Blog = async(blog) => {
  return await api
    .post ('/api/blogs')
    .send(blog)
    .expect(400)
}

const deleteBlog = async(id) => {
  await api
    .delete(`/api/blogs/${id}`)
    .expect(204)
}

const updateBlog = async(blog) => {
   return await api
    .put(`/api/blogs/${blog.id}`)
    .send(blog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
}

const getUsers = async() => {
  return await api
    .get('/api/users')
    .expect(200)
}

const createUser = async(user) => {
  return await api
    .post('/api/users')
    .send(user)
    .expect(201)
    .expect('Content-Type', /application\/json/)
}

const createWrongUser = async(user) => {
  return await api
    .post('/api/users')
    .send(user)
    .expect(400)
}

module.exports = {
    getBlogs,
    createBlog,
    create400Blog,
    deleteBlog,
    updateBlog,
    getUsers,
    createUser,
    createWrongUser
}
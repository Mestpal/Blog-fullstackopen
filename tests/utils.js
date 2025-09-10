
const app = require('../App')
const supertest = require('supertest')
const api = supertest(app)

const getBlogs = async() => {
  return await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}

const createBlog = async(blog, token) => {
  return await api
    .post ('/api/blogs')
    .set('Authorization', `Bearer ${token}` )
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
}

const create400Blog = async(blog, token) => {
  return await api
    .post ('/api/blogs')
    .set('Authorization', `Bearer ${token}` )
    .send(blog)
    .expect(400)
}

const createBlogNoToken = async() => {
  return await api
    .post ('/api/blogs')
    .send({})
    .expect(401)
}

const deleteBlog = async(id, token) => {
  await api
    .delete(`/api/blogs/${id}`)
    .set('Authorization', `Bearer ${token}` )
    .expect(204)
}

const updateBlog = async(blog, token) => {
   return await api
    .put(`/api/blogs/${blog.id}`)
    .set('Authorization', `Bearer ${token}` )
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

const login = async(user) => {
  return await api
    .post('/api/login')
    .send(user)
    .expect(200)
}

module.exports = {
    getBlogs,
    createBlog,
    create400Blog,
    createBlogNoToken,
    deleteBlog,
    updateBlog,
    getUsers,
    createUser,
    createWrongUser,
    login
}
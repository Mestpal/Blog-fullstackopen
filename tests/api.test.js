const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../App')
const Blog = require('../models/blogs')

const api = supertest(app)
const defaultBlogs = require('./blogs')

const getBlogs = async() => {
  return await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}

after(async () => {
  await mongoose.connection.close()
  console.log('Conection to DB closed!');
})

beforeEach(async() => {
  await Blog.deleteMany({})
  const blogsToSave = defaultBlogs.map(conf => new Blog(conf))
  const promises = blogsToSave.map(blog => blog.save())
  await Promise.all(promises)
})

describe('Api requests', () => {
  test('api blogs returns expected number of blogs as JSON' ,async () => {
    const retrieveBlogs = await getBlogs()

    assert.strictEqual(retrieveBlogs.body.length, defaultBlogs.length)
  })

  test('blog contains id attribute' ,async () => {
    const retrieveBlogs = await getBlogs()

    retrieveBlogs.body.forEach( entry => {
      assert.ok(Object.prototype.hasOwnProperty.call(entry, 'id'))
    })
  })
})
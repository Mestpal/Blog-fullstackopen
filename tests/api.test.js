const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../App')
const Blog = require('../models/blogs')
const logger = require('../utils/logger')

const api = supertest(app)
const defaultBlogs = require('./blogs')

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

after(async () => {
  await mongoose.connection.close()
  logger.info('Conection to DB closed!');
})

beforeEach(async() => {
  await Blog.deleteMany({})
  const blogsToSave = defaultBlogs.map(conf => new Blog(conf))
  const promises = blogsToSave.map(blog => blog.save())
  await Promise.all(promises)
})

describe('Format and get data', () => {
  test('api blogs returns expected number of blogs as JSON', async () => {
    const retrieveBlogs = await getBlogs()

    assert.strictEqual(retrieveBlogs.body.length, defaultBlogs.length)
  })

  test('blog contains id attribute', async () => {
    const retrieveBlogs = await getBlogs()

    retrieveBlogs.body.forEach( entry => {
      assert.ok(Object.prototype.hasOwnProperty.call(entry, 'id'))
    })
  })
})

describe('Create blog tests', () => {
  test('Create a new blog entry', async () => {
    const oldBlogs = await getBlogs()
    const createdBlog = await createBlog(defaultBlogs[0])
    const newBlogs = await getBlogs()
    let blogsIds = [];

    newBlogs.body.forEach( entry => {
      blogsIds.push(entry.id)
    })

    assert.strictEqual(oldBlogs.body.length + 1, newBlogs.body.length)
    assert.ok(blogsIds.includes(createdBlog.body.id))
  })

  test('Likes are 0 if the attribute likes do not exits', async () => {
    const blogToSave = defaultBlogs[0]
    delete blogToSave.likes
    const createdBlog = await createBlog(blogToSave)

    assert.ok(!Object.prototype.hasOwnProperty.call(blogToSave, 'likes'))
    assert.strictEqual(createdBlog.body.likes, 0)
  })

  test('Returns 400 if title attr is missing', async () => {
    const blogToSave = defaultBlogs[0]
    delete blogToSave.title
    await create400Blog(blogToSave)
  })

  test('Returns 400 if url attrs is missing', async () => {
    const blogToSave = defaultBlogs[1]
    delete blogToSave.url
    await create400Blog(blogToSave)
  })

  test('Returns 400 if title and url attrs are missing', async () => {
    const blogToSave = defaultBlogs[2]
    delete blogToSave.title
    delete blogToSave.url
    await create400Blog(blogToSave)
  })
})

describe('Remove blogs', () => {
  test('Only one deletion', async() => {
    const actualBlogsOnDB = await getBlogs()

    await api
      .delete(`/api/blogs/${actualBlogsOnDB.body[0].id}`)
      .expect(204)

    const afterBlogsOnDB = await getBlogs()
    let blogsIds = [];

    afterBlogsOnDB.body.forEach( entry => {
      blogsIds.push(entry.id)
    })

    assert.strictEqual(actualBlogsOnDB.body.length -1, afterBlogsOnDB.body.length)
    assert.ok(!blogsIds.includes(actualBlogsOnDB.body[0].id))
  })
})

describe('Update blogs', () => {
  test('Update one entry' ,async() => {
    const actualBlogsOnDB = await getBlogs()
    let blogUpdate = actualBlogsOnDB.body[0]
    blogUpdate.likes = 34
    blogUpdate.title = 'TEST'

    const result = await api
      .put(`/api/blogs/${actualBlogsOnDB.body[0].id}`)
      .send(blogUpdate)
      .expect(200)

    assert.strictEqual(blogUpdate.likes, result.body.likes)
    assert.strictEqual(blogUpdate.title, result.body.title)
  })
})
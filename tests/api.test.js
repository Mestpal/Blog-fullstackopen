const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const logger = require('../utils/logger')
const Utils = require('./utils')
const defaultBlogs = require('./blogs')

const Blog = require('../models/blogs')
const User = require('../models/user')

const { result } = require('lodash')

after(async () => {
  await mongoose.connection.close()
  logger.info('Conection to DB closed!');
})

beforeEach(async() => {
  await Blog.deleteMany({})
  const blogsToSave = defaultBlogs.map(conf => new Blog(conf))
  const promises = blogsToSave.map(blog => blog.save())
  await Promise.all(promises)

  await User.deleteMany({})
})

describe('Format and get data', () => {
  test('api blogs returns expected number of blogs as JSON', async () => {
    const retrieveBlogs = await Utils.getBlogs()

    assert.strictEqual(retrieveBlogs.body.length, defaultBlogs.length)
  })

  test('blog contains id attribute', async () => {
    const retrieveBlogs = await Utils.getBlogs()

    retrieveBlogs.body.forEach( entry => {
      assert.ok(result.prototype.hasOwnProperty.call(entry, 'id'))
    })
  })
})

describe('Create blog tests', () => {
  test('Create a new blog entry', async () => {
    const oldBlogs = await Utils.getBlogs()
    const createdBlog = await Utils.createBlog(defaultBlogs[0])
    const newBlogs = await Utils.getBlogs()
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
    const createdBlog = await Utils.createBlog(blogToSave)

    assert.ok(!result.prototype.hasOwnProperty.call(blogToSave, 'likes'))
    assert.strictEqual(createdBlog.body.likes, 0)
  })

  test('Returns 400 if title attr is missing', async () => {
    const blogToSave = defaultBlogs[0]
    delete blogToSave.title
    await Utils.create400Blog(blogToSave)
  })

  test('Returns 400 if url attrs is missing', async () => {
    const blogToSave = defaultBlogs[1]
    delete blogToSave.url
    await Utils.create400Blog(blogToSave)
  })

  test('Returns 400 if title and url attrs are missing', async () => {
    const blogToSave = defaultBlogs[2]
    delete blogToSave.title
    delete blogToSave.url
    await Utils.create400Blog(blogToSave)
  })
})

describe('Remove blogs', () => {
  test('Only one deletion', async() => {
    const actualBlogsOnDB = await Utils.getBlogs()

    await Utils.deleteBlog(actualBlogsOnDB.body[0].id)

    const afterBlogsOnDB = await Utils.getBlogs()
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
    const actualBlogsOnDB = await Utils.getBlogs()
    let blogUpdate = actualBlogsOnDB.body[0]
    blogUpdate.likes = 34
    blogUpdate.title = 'TEST'
    blogUpdate.url="https://test.com/"

    const result = await Utils.updateBlog(blogUpdate)

    assert.strictEqual(blogUpdate.likes, result.body.likes)
    assert.strictEqual(blogUpdate.title, result.body.title)
    assert.strictEqual(blogUpdate.url, result.body.url)
  })
})

describe('Users API', () => {
  const newUser = {
    "name": "Test",
    "username": "test",
    "password": "test"
  }

  const wrongUser = {
    "name": "Test",
    "username": "te",
    "password": "test"
  }

  const wrongUserNoUsername= {
    "name": "Test",
    "password": "test"
  }

  const wrongUserPassword = {
    "name": "Test",
    "username": "test",
    "password": "te"
  }

  test('Create a new User', async() => {
    const current = await Utils.getUsers()
    const result = await Utils.createUser(newUser)
    const after = await Utils.getUsers()
    const userIds = after.body.map(u => u.id)

    assert.strictEqual(current.body.length + 1, after.body.length)
    assert.ok(userIds.includes(result.body.id))
  })

  test('Avoid to create a new User with an duplicated username', async() => {
    const current = await Utils.getUsers()
    const savedUser = await Utils.createUser(newUser)
    const result = await Utils.createWrongUser(newUser)
    const after = await Utils.getUsers()
    const userIds = after.body.map(u => u.id)

    assert.strictEqual(current.body.length + 1, after.body.length)
    assert.ok(userIds.includes(savedUser.body.id))
    assert.ok(Object.prototype.hasOwnProperty.call(result, 'error'), result.error)
  })

  test('Avoid create an user without username', async() => {
    const current = await Utils.getUsers()
    const result = await Utils.createWrongUser(wrongUserNoUsername)
    const after = await Utils.getUsers()

    assert.strictEqual(current.body.length, after.body.length)
    assert.ok(Object.prototype.hasOwnProperty.call(result, 'error'), result.error)
  })

  test('Avoid create an user with invalid username', async() => {
    const current = await Utils.getUsers()
    const result = await Utils.createWrongUser(wrongUser)
    const after = await Utils.getUsers()

    assert.strictEqual(current.body.length, after.body.length)
    assert.ok(Object.prototype.hasOwnProperty.call(result, 'error'), result.error)
  })

  test('Avoid create an user with invalid password', async() => {
    const current = await Utils.getUsers()
    const result = await Utils.createWrongUser(wrongUserPassword)
    const after = await Utils.getUsers()

    assert.strictEqual(current.body.length, after.body.length)
    assert.ok(Object.prototype.hasOwnProperty.call(result, 'error'), result.error)
  })
})
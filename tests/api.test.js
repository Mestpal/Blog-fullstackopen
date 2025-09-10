const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const logger = require('../utils/logger')
const Utils = require('./utils')
const defaultBlogs = require('./blogs')
const defaultUsers = require('./users')

const Blog = require('../models/blogs')
const User = require('../models/user')

const { result } = require('lodash')

let token = undefined

after(async () => {
  await mongoose.connection.close()
  logger.info('Conection to DB closed!');
})

beforeEach(async() => {
  await User.deleteMany({})
  const user = await Utils.createUser(defaultUsers.user)

  await Blog.deleteMany({})
  const blogsToSave = defaultBlogs.map(conf =>
    new Blog({ ...conf, user: user.body.id })
  )
  const promises = blogsToSave.map(blog => blog.save())
  await Promise.all(promises)
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
    let found = undefined

    const login = await Utils.login(defaultUsers.user)
    token = login.body.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (decodedToken.id) {
      found = await User.findById(decodedToken.id)

      if (found?._id && decodedToken.id === found._id.toString()) {
        let newBlog = defaultBlogs[0]
        newBlog.user = decodedToken.id

        const oldBlogs = await Utils.getBlogs()
        const createdBlog = await Utils.createBlog(newBlog, token)
        const newBlogs = await Utils.getBlogs()
        let blogsIds = [];

        newBlogs.body.forEach( entry => {
          blogsIds.push(entry.id)
        })

        assert.strictEqual(oldBlogs.body.length + 1, newBlogs.body.length)
        assert.ok(blogsIds.includes(createdBlog.body.id))
      }
    }

    assert.ok(Object.prototype.hasOwnProperty.call(decodedToken, 'id'))
    assert.strictEqual(decodedToken.id, found._id.toString())
  })

  test('Error 401 if no token is given in a new blog creation', async () => {
    await Utils.createBlogNoToken()
  })

  test('Likes are 0 if the attribute likes do not exits', async () => {
    let found = undefined
    let createdBlog = undefined

    const login = await Utils.login(defaultUsers.user)
    token = login.body.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (decodedToken.id) {
      found = await User.findById(decodedToken.id)

      if (found?._id && decodedToken.id, found._id.toString()) {
        let blogToSave = defaultBlogs[0]
        blogToSave.user = decodedToken.id
        delete blogToSave.likes
        createdBlog = await Utils.createBlog(blogToSave, token)

        assert.ok(!result.prototype.hasOwnProperty.call(blogToSave, 'likes'))
      }
    }

    assert.strictEqual(createdBlog.body.likes, 0)
    assert.ok(Object.prototype.hasOwnProperty.call(decodedToken, 'id'))
    assert.strictEqual(decodedToken.id, found._id.toString())
  })

  test('Returns 400 if title attr is missing', async () => {
    const login = await Utils.login(defaultUsers.user)
    token = login.body.token

    let blogToSave = defaultBlogs[0]
    delete blogToSave.title
    await Utils.create400Blog(blogToSave, token)
  })

  test('Returns 400 if url attrs is missing', async () => {
    const login = await Utils.login(defaultUsers.user)
    token = login.body.token

    let blogToSave = defaultBlogs[1]
    delete blogToSave.url
    await Utils.create400Blog(blogToSave, token)
  })

  test('Returns 400 if title and url attrs are missing', async () => {
    const login = await Utils.login(defaultUsers.user)
    token = login.body.token

    let blogToSave = defaultBlogs[2]
    delete blogToSave.title
    delete blogToSave.url
    await Utils.create400Blog(blogToSave, token)
  })
})

describe('Remove blogs', () => {
  test('Only one deletion', async() => {
    let found = undefined

    const login = await Utils.login(defaultUsers.user)
    token = login.body.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (decodedToken.id) {
      found = await User.findById(decodedToken.id)

      if (found?._id && decodedToken.id === found._id.toString()) {
        const actualBlogsOnDB = await Utils.getBlogs()

        await Utils.deleteBlog(actualBlogsOnDB.body[0].id, token)

        const afterBlogsOnDB = await Utils.getBlogs()
        let blogsIds = [];

        afterBlogsOnDB.body.forEach( entry => {
          blogsIds.push(entry.id)
        })

        assert.strictEqual(actualBlogsOnDB.body.length -1, afterBlogsOnDB.body.length)
        assert.ok(!blogsIds.includes(actualBlogsOnDB.body[0].id))
      }
    }

    assert.ok(Object.prototype.hasOwnProperty.call(decodedToken, 'id'))
    assert.strictEqual(decodedToken.id, found._id.toString())
  })
})

describe('Update blogs', () => {
  test('Update one entry' ,async() => {
    const login = await Utils.login(defaultUsers.user)
    token = login.body.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    const actualBlogsOnDB = await Utils.getBlogs()
    let blogUpdate = actualBlogsOnDB.body[0]
    blogUpdate.likes = 34
    blogUpdate.title = 'TEST'
    blogUpdate.url= "https://test.com/"
    blogUpdate.user= decodedToken.id

    const result = await Utils.updateBlog(blogUpdate, token)

    assert.ok(Object.prototype.hasOwnProperty.call(decodedToken, 'id'))
    assert.strictEqual(blogUpdate.likes, result.body.likes)
    assert.strictEqual(blogUpdate.title, result.body.title)
    assert.strictEqual(blogUpdate.url, result.body.url)
    assert.strictEqual(blogUpdate.user, result.body.user)
  })
})

describe('Users API', () => {
  test('Create a new User', async() => {
    const current = await Utils.getUsers()
    const result = await Utils.createUser(defaultUsers.newUser)
    const after = await Utils.getUsers()
    const userIds = after.body.map(u => u.id)

    assert.strictEqual(current.body.length + 1, after.body.length)
    assert.ok(userIds.includes(result.body.id))
  })

  test('Avoid to create a new User with an duplicated username', async() => {
    const current = await Utils.getUsers()
    const savedUser = await Utils.createUser(defaultUsers.newUser)
    const result = await Utils.createWrongUser(defaultUsers.newUser)
    const after = await Utils.getUsers()
    const userIds = after.body.map(u => u.id)

    assert.strictEqual(current.body.length + 1, after.body.length)
    assert.ok(userIds.includes(savedUser.body.id))
    assert.ok(Object.prototype.hasOwnProperty.call(result, 'error'), result.error)
  })

  test('Avoid create an user without username', async() => {
    const current = await Utils.getUsers()
    const result = await Utils.createWrongUser(defaultUsers.wrongUserNoUsername)
    const after = await Utils.getUsers()

    assert.strictEqual(current.body.length, after.body.length)
    assert.ok(Object.prototype.hasOwnProperty.call(result, 'error'), result.error)
  })

  test('Avoid create an user with invalid username', async() => {
    const current = await Utils.getUsers()
    const result = await Utils.createWrongUser(defaultUsers.wrongUser)
    const after = await Utils.getUsers()

    assert.strictEqual(current.body.length, after.body.length)
    assert.ok(Object.prototype.hasOwnProperty.call(result, 'error'), result.error)
  })

  test('Avoid create an user with invalid password', async() => {
    const current = await Utils.getUsers()
    const result = await Utils.createWrongUser(defaultUsers.wrongUserPassword)
    const after = await Utils.getUsers()

    assert.strictEqual(current.body.length, after.body.length)
    assert.ok(Object.prototype.hasOwnProperty.call(result, 'error'), result.error)
  })
})
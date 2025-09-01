const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('./blogs')


const mostBlogs = {
  author: "Robert C. Martin",
  blogs: 3
}

describe('Author with most blogs', () => {
  test('when blogs are an empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.deepStrictEqual(result, {})
  })

  test('when blog list is size one', () => {
    const result = listHelper.mostBlogs([blogs[0]])
    assert.deepStrictEqual(result, { author: 'Michael Chan', blogs: 1 })
  })

  test('in a list of blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, mostBlogs)
  })
})
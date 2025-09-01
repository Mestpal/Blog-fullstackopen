const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('./blogs')


const favBlog = {
  __v: 0,
  _id: '5a422b3a1b54a676234d17f9',
  author: 'Edsger W. Dijkstra',
  likes: 12,
  title: 'Canonical string reduction',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
}

describe('Faovorite blog', () => {
  test('of empty list is {}', () => {
    const result = listHelper.favoriteBlog([])
    assert.deepStrictEqual(result, {})
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.favoriteBlog([favBlog])
    assert.deepStrictEqual(result, favBlog)
  })

  test('in a list of blogs', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, favBlog)
  })
})
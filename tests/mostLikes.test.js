const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('./blogs')


const mostLikes = {
  author: "Edsger W. Dijkstra",
  likes: 17
}

describe('Author with most Likes', () => {
  test('when blogs are an empty list', () => {
    const result = listHelper.mostLikes([])
    assert.deepStrictEqual(result, {})
  })

  test('when blog list is size one', () => {
    const result = listHelper.mostLikes([blogs[0]])
    assert.deepStrictEqual(result, { author: 'Michael Chan', likes: 7 })
  })

  test('in a list of blogs', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, mostLikes)
  })
})
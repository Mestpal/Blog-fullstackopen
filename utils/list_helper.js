const _ = require('lodash');

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likesSum = (result, blog) => {
    return blog?.likes
      ? result + blog.likes
      : result
  }
  return blogs.reduce(likesSum,0)
}

const favoriteBlog = (blogs) => {
  const findFav = (fav, blog) => {
    return fav?.likes > blog?.likes
      ? fav
      : blog
  }

  return blogs.reduce(findFav, {})
}

const mostBlogs = (blogs) => {
  const grouped = _.groupBy(blogs, 'author');
  const counters = _.mapValues(grouped, (group) => group.length)

  return Object.keys(counters).reduce((maxBlogger, author) => {
    return counters[author] >= maxBlogger?.blogs || !maxBlogger?.blogs
      ? { "author": author, "blogs": counters[author] }
      : maxBlogger
  },{})
}

const mostLikes  = (blogs) => {
  const grouped = _.groupBy(blogs, 'author');
  const counters = _.mapValues(grouped, (group) => {
    return group.reduce((sum, blog) => {
      return blog.likes
        ? sum += blog.likes
        : sum

    }, 0)
  })

  return Object.keys(counters).reduce((maxBlogger, author) => {
    return counters[author] >= maxBlogger?.likes || !maxBlogger?.likes
      ? { "author": author, "likes": counters[author] }
      : maxBlogger
  },{})
}

module.exports = {
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes
}
const dummy = (blogs) => {
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

module.exports = {
  dummy,
  favoriteBlog,
  totalLikes
}
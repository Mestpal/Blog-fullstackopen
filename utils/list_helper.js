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

module.exports = {
  dummy,
  totalLikes
}
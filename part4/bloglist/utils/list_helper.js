const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    return blogs.reduce((total, cur) => total = total + cur.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((prev, cur) => (prev.likes > cur.likes? prev:cur))
}

module.exports = {
dummy,
totalLikes,
favoriteBlog
}
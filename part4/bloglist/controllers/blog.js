const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({}).populate('user',{username: 1, name: 1})
    response.json(blogs)
})


blogsRouter.get('/:id', async(request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})


blogsRouter.post('/', async(request, response) => {
    const body = request.body
    const token = request.token
    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = new Blog({
      ...body,
      user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(204).end()
  }

  if (blog.user && blog.user.toString() !== request.user.id) {
    response.status(401).json({'error': 'unauthorized user'})
  } else {
    await Blog.findByIdAndRemove(id)
    response.status(204).end()
  }
})


blogsRouter.put('/:id', async(request, response) => {

    const blog = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
    response.json(updatedBlog)
  })

module.exports = blogsRouter
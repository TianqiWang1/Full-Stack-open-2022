const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


  
beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})



test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test('the blog list application returns the correct amount of blog posts', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})
  


  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain(
        'Go To Statement Considered Harmful'
      )
})


test('unique identifier property of the blog is named id', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(r => r.id)
    for (const id of ids) {
        expect(id).toBeDefined()
    }
})


test('a valid blog can be added', async () => {
    const newBlog =  {
        title: 'dummy',
        author: 'dummy',
        url: 'http://www.dummy.com',
        likes: 2
      }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
  
    const contents = response.body.map(r => r.title)
  
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain('dummy')
  })


test('likes default to 0', async () => {
const newBlog =  {
    title: 'likes default to 0',
    author: 'test',
    url: 'http://www.test.com',
    }

await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

const response = await helper.blogsInDb()
expect(response[response.length-1].likes).toBe(0)
})


test('title/url are required', async () => {
const newBlog =  {
    author: 'test',
    }

await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

const response = await helper.blogsInDb()
expect(response).toHaveLength(helper.initialBlogs.length)
})


afterAll(() => {
  mongoose.connection.close()
})
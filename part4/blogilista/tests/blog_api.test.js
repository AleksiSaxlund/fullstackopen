const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
let authenticatedAgent

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('salasana', 10)
  const testUser = new User({ username: 'testerly', passwordHash })
  const savedUser = await testUser.save()

  await Blog.deleteMany({})
  const blogsWithUser = helper.initialBlogs.map(blog => ({
    ...blog,
    user: savedUser._id
  }))
  await Blog.insertMany(blogsWithUser)

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testerly', password: 'salasana' })
  
  authenticatedAgent = supertest.agent(app)
  authenticatedAgent.set('Authorization', `Bearer ${loginResponse.body.token}`)
})

describe('returned blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('proper amount is returned', async () => {
    const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

  test('have proper id field', async () => {
    const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual('id' in response.body[0], true)
    assert.strictEqual('_id' in response.body[0], false)
  })
})

describe('adding blogs', () => {
  describe('logged in', () => {
    test('increases saved blog count', async () => {
      await authenticatedAgent
        .post('/api/blogs')
        .send(helper.newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    })
      
    test('adding blog with no value on likes', async () => {
      const response = await authenticatedAgent
        .post('/api/blogs')
        .send(helper.blogWithNoLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      //const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.likes, 0)
    })

    test('adding blog with no title returns error', async () => {
      const response = await authenticatedAgent
        .post('/api/blogs')
        .send(helper.blogWithNoTitle)
        .expect(400)
      
      assert.strictEqual(response.status, 400)
    })

    test('adding blog with no url returns error', async () => {
      const response = await authenticatedAgent
        .post('/api/blogs')
        .send(helper.blogWithNoUrl)
        .expect(400)
      
      assert.strictEqual(response.status, 400)
    })
  })
  
})

describe('deleting blogs', () => {
  test('deletes blog from database', async () => {
    const notesAtStart = await helper.blogsInDb()
    const blogToDelete = notesAtStart[0]

    await authenticatedAgent
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(b => b.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

describe('updating blogs', () => {
  test('updated blog in database', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const blogToCheck = blogsAtEnd.find(b => b.id === blogToUpdate.id)

    assert.strictEqual(blogToCheck.likes, blogToUpdate.likes + 1)
  })

  test.only('updated blog with no likes field works', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const { likes, ...blogWithNoLikes } = blogToUpdate

    await api
      .put(`/api/blogs/${blogWithNoLikes.id}`)
      .send(blogWithNoLikes)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const blogToCheck = blogsAtEnd.find(b => b.id === blogWithNoLikes.id)

    assert.strictEqual(blogToCheck.likes, 0)
  })
})


after(async () => {
  await mongoose.connection.close()
})
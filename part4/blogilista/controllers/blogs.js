const blogsRouter = require('express').Router()
const { response } = require('../app')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')


//const getTokenFrom = request => {
// const authorization = request.get('authorization')
//  if (authorization && authorization.startsWith('Bearer ')) {
//    return authorization.replace('Bearer ', '')
//  }
//  return null
//}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
  })

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const userInDb = await User.findById(user.id)
  if (!userInDb) {
    return response.status(404).json({ error: 'account not found' })
  }

  const newBlog = new Blog({
    title: title,
    author: author,
    url: url,
    user: userInDb._id,
    likes: likes || 0
  })

  const savedBlog = await newBlog.save()

  userInDb.blogs = userInDb.blogs.concat(savedBlog._id)
  await userInDb.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id',userExtractor, async (request, response) => {

  const user = request.user
  if (!user || !user.id) {
    return response.status(401).json({ error: 'token invalid'})
  }
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'creator only can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes = 0 } = request.body

  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter
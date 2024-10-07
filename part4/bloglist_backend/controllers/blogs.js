const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
    const { title, author, url, likes } = request.body

    if (!title || !url) {
      return response.status(400).json({ error: 'title or url missing' })
    }
  
    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0
    })
  
    blog.save()
      .then(savedBlog => {
        response.json(savedBlog)
      })
      .catch(error => next(error))
  })
  

blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
    const { title, author, url, likes } = request.body
  
    const blog = {
      title,
      author,
      url,
      likes
    }
  
    Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
      .then(updatedBlog => {
        if (updatedBlog) {
          response.json(updatedBlog)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })
  
module.exports = blogsRouter
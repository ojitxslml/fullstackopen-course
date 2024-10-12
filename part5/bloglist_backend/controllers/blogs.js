const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
   const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', async (request, response, next) => {
  const { title, author, url, likes } = request.body;

  // Validar antes de llamar a userExtractor
  if (!title || !url) {
    return response.status(400).json({ error: 'title or url missing' });
  }

  // Si la validación pasa, proceder a extraer el usuario
  middleware.userExtractor(request, response, async () => {
    const blog = new Blog({
      title,
      author,
      url,
      likes: likes !== undefined ? likes : 0,
      user: request.user.id // Usar el usuario del objeto request
    });

    try {
      const savedBlog = await blog.save();
      request.user.blogs = request.user.blogs.concat(savedBlog._id);
      await request.user.save();
      response.status(201).json(savedBlog);
    } catch (error) {
      next(error); // Manejo de errores
    }
  });
});



blogsRouter.delete('/:id',middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }

  if (request.user.id.toString() === blog.user.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    return response.status(204).end();
  } else {
    return response.status(403).json({ error: 'permission denied' });
  }
});


blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = {
    title,
    author,
    url,
    likes
  };

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true, runValidators: true, context: 'query' }
  );

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;

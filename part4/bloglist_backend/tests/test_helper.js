const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'Author 1',
    url: 'http://example1.com',
    likes: 1
  },
  {
    title: 'Second Blog',
    author: 'Author 2',
    url: 'http://example2.com',
    likes: 5
  }
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb
};

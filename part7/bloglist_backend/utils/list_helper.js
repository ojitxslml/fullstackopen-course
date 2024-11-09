const _ = require("lodash");
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length > 1) {
    let likes = 0;
    blogs.forEach((blog) => {
      likes = blog.likes + likes;
    });
    return likes;
  } else if (blogs.length === 0) {
    return 0;
  }
  return blogs[0].likes;
};

const favoriteBlog = (blogs) => {
  const mostLikedBlog = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max;
  }, blogs[0]);
  const { title, author, likes } = mostLikedBlog;
  return { title, author, likes };
};

const mostBlogs = (blogs) => {
  const authors = _.countBy(blogs, "author");
  const topAuthor = _.maxBy(
    Object.entries(authors),
    ([author, count]) => count
  );
  return {
    author: topAuthor[0],
    blogs: topAuthor[1],
  };
};

const mostLikes = (blogs) => {
  const authorLikes = _.reduce(
    blogs,
    (acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
      return acc;
    },
    {}
  );

  const topAuthor = _.maxBy(
    Object.entries(authorLikes),
    ([author, likes]) => likes
  );

  return {
    author: topAuthor[0],
    likes: topAuthor[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};

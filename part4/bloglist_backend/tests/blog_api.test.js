const { test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("blogs are returned as json", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("unique identifier is named id", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    assert.ok(blog.id, "Blog does not have an id property");
    assert.strictEqual(
      typeof blog.id,
      "string",
      "The id property should be a string"
    );
  });
});

test("a new blog can be created", async () => {
  const newBlog = {
    title: "New Blog Title",
    author: "Author Name",
    url: "http://example.com",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201) //created code
    .expect("Content-Type", /application\/json/);

  // blogs are higher
  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((b) => b.title);
  assert(titles.includes("New Blog Title"));
});

test("likes default to 0 if missing", async () => {
  const newBlog = {
    title: "Blog without likes",
    author: "Author Name",
    url: "http://example.com",
    // 'likes' null
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  // likes is 0
  assert.strictEqual(response.body.likes, 0);
});

test("responds with status 400 if title is missing", async () => {
  const newBlog = {
    author: "Author Name",
    url: "http://example.com",
    likes: 5,
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(400);

  assert.strictEqual(response.body.error, "title or url missing");
});

test("responds with status 400 if url is missing", async () => {
  const newBlog = {
    title: "Blog without URL",
    author: "Author Name",
    likes: 5,
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(400);

  assert.strictEqual(response.body.error, "title or url missing");
});

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((b) => b.title);
  assert(!titles.includes(blogToDelete.title));
});

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const updatedData = {
    likes: blogToUpdate.likes + 1
  };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, updatedData.likes);

  const blogsAtEnd = await helper.blogsInDb();
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id);
  assert.strictEqual(updatedBlog.likes, updatedData.likes);
});


after(async () => {
  await mongoose.connection.close();
});

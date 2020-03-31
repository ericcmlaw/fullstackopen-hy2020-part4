const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs
    .map((blog) => new Blog(blog));

  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('unique identifier property of the blog posts is named id,', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body.map((b) => b.id)).toBeDefined();
});


test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((n) => n.title);
  expect(titles).toContain(
    'Go To Statement Considered Harmful',
  );
});

test('likes property is missing from the request', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const likes = blogsAtEnd.map((n) => n.likes);
  expect(likes).toContainEqual(
    0,
  );
});

test('title and url properties are missing', async () => {
  const newBlog = {
    author: 'Edsger W. Dijkstra',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

test('deleting a single blog post resource', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1,
  );

  const urls = blogsAtEnd.map((r) => r.url);

  expect(urls).not.toContain(blogToDelete.url);
});

test('update the amount of likes for a blog post', async () => {
  const blogsAtStart = await helper.blogsInDb();
  let blogToUpdate = blogsAtStart[0];

  blogToUpdate.likes = 696969;

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200);

  const blogsAtEnd = await helper.blogsInDb();

  const likes = blogsAtEnd.map((r) => r.likes);

  expect(likes).toContain(blogToUpdate.likes);
});

afterAll(() => {
  mongoose.connection.close();
});

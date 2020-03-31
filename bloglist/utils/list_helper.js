// 4.3
const dummy = (blogs) => 1;

// 4.4
const totalLikes = (blogs) => blogs.reduce((sum, item) => sum + item.likes, 0);

// 4.5
const favoriteBlogs = (blogs) => blogs.find((blog) => blog.likes === Math.max(...blogs.map((x) => x.likes), 0)) || null;


// todo
const mostBlogs = (blogs) => null;
const mostLikes = (blogs) => null;

module.exports = {
  dummy,
  totalLikes,
  favoriteBlogs,
  mostBlogs,
  mostLikes,
};

const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const loginRouter = require('./controllers/login');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');

const config = require('./utils/config');
const logger = require('./utils/logger');

logger.info('connecting to', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(middleware.tokenExtractor);

app.use(express.json());


app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);

app.use(middleware.errorHandler);


module.exports = app;

const jwt = require('jsonwebtoken');

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    });
  }

  return next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  console.log(request);
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  return next();
};


module.exports = {
  errorHandler,
  tokenExtractor,
};

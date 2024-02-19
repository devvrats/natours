const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const HandleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/"(.*?)"/)[0];

  const message = `Duplicate field value ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  console.log(err.errors);
  const errors = Object.values(err.errors)
    .map((el) => el.message)
    .join(',');
  console.log(errors);
  const message = `Invalid input data. ${errors}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error:send message to client
 
  if (err.isOperation) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknow error:don't leak error details
  } else {
    // 1) Log error
    console.error(`Error 💥`, err);

    //2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    error.errmsg = err.errmsg;
    if (err.code === 11000) error = HandleDuplicateFieldsDB(error);

    error.errors = err.errors;
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};

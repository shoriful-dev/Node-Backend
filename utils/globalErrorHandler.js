const developerError = (error, res) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message: error.message,
    statusCode: error.statusCode,
    status: error.status,
    stack: error.stack,
    data: error.data,
    isOperationalError: error.isOperationalError,
  });
};

const productionError = (error, res) => {
  const statusCode = error.statusCode || 500;
  const isOperationalError = error.isOperationalError;
  if (isOperationalError) {
    return res.status(statusCode).json({
      message: error.message,
      statusCode: statusCode,
    });
  } else {
    return res.status(statusCode).json({
      message: 'Internal Server Error Try again !!',
      statusCode: statusCode,
    });
  }
};

exports.globalErrorHandler = (error, req, res, next) => {
  if (process.env.NODE_ENV == 'development') {
    developerError(error, res);
  } else {
    productionError(error, res);
  }
};

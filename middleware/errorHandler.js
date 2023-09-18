const ErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal server Error';
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
        notfound: req.path,
        stack: err.stack,
    })
}

module.exports = ErrorHandler;
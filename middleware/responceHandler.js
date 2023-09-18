const commonResponseHandler = (req, res, next) => {
    res.sendResponse = (data, status = 200, message = 'Success') => {
        res.status(status).json({
            status,
            message,
            data,
        });
    };
    next();
};
module.exports = { commonResponseHandler }
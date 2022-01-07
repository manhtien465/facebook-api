const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const APIError = require('../../common/utils/APIError');
const { env } = require('../../config/vars');

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
    const { status = 500 } = err;

    const response = {
        code: status,
        message: err.message || httpStatus[status],
        errors: err.errors,
        stack: err.stack
    };

    response.message = !err.isTranslated
        ? res.__(response.message)
        : response.message;

    if (env !== 'development') {
        delete response.stack;
    }

    // res.status(status);
    res.json(response);
    res.end();
};
exports.handler = handler;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
    let convertedError = err;

    if (err instanceof expressValidation.ValidationError) {
        convertedError = new APIError({
            message: res.__('Validation Error!'),
            errors: err.errors,
            status: err.status,
            stack: err.stack,
            isTranslated: true
        });
    } else if (!(err instanceof APIError)) {
        convertedError = new APIError({
            message: res.__(err.message),
            status: err.status,
            stack: err.stack,
            isTranslated: true
        });
    }

    return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
    const err = new APIError({
        message: res.__('Not found!'),
        status: httpStatus.NOT_FOUND,
        isTranslated: true
    });
    return handler(err, req, res);
};

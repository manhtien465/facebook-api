import { handler as ErrorHandler } from '../../middlewares/error';


exports.listPost = async (req, res, next) => {
    try {
        return res.status(200).send(req.query['hub.challenge']);
    } catch (ex) {
        return ErrorHandler(ex, req, res, next);
    }
};
exports.connect = async (req, res, next) => {
    try {
        return res.json({ data: req.locals.data });
    } catch (ex) {
        return ErrorHandler(ex, req, res, next);
    }
};

/**
 * confirm
 *
 * @public
 * @param {String} id
 * @returns {Promise<PostCategory[], APIError>}
 */
exports.confirm = async (req, res, next) => {
    try {
        return res.status(200).send(req.query['hub.challenge']);
    } catch (ex) {
        return ErrorHandler(ex, req, res, next);
    }
};

/**
 * receive
 */
exports.recieve = async (req, res, next) => {
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
    // } else {
    // // Returns a '404 Not Found' if event is not from a page subscription
    //     res.sendStatus(404);
    // }
};

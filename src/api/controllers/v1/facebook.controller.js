import { handler as ErrorHandler } from '../../middlewares/error';

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
    const body = req.body;
    console.log('đã có webhook');
    console.log(req.body);
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
        body.entry.forEach((entry) => {
            console.log(entry);
        });
    }
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
    // } else {
    // // Returns a '404 Not Found' if event is not from a page subscription
    //     res.sendStatus(404);
    // }
};

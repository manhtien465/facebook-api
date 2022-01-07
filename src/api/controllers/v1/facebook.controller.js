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

    // Checks this is an event from a page subscription
    if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
        body.entry.forEach((entry) => {
            // Gets the message. entry.messaging is an array, but
            // will only ever contain one message, so we get index 0
            const webhook_event = entry.messaging[0];
            console.log(webhook_event);
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
    // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

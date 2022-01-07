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
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
        body.entry.forEach((entry) => {
            if (entry.changes && entry.changes.length > 0) {
                entry.changes.map((v) => {
                    console.log(v);
                    return null;
                });
            }
        });
    }
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
    // } else {
    // // Returns a '404 Not Found' if event is not from a page subscription
    //     res.sendStatus(404);
    // }
};

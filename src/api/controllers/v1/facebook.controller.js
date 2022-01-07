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
    try {
        console.log(req.body.entry);
        console.log(req.body.entry[0].changes);
        return res.status(200).send({ messagge: 'ok' });
    } catch (ex) {
        return ErrorHandler(ex, req, res, next);
    }
};

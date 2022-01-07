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

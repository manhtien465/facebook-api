import { pick } from 'lodash';

import messages from '../../../config/messages';
import { handler as ErrorHandler } from '../../middlewares/error';
import SocialNetwork from '../../../common/models/social-network.model';

/**
 * Create
 *
 * @public
 * @param body as SocialNetWork
 * @returns {Promise<SocialNetwork>, APIError>}
 */
exports.create = async (req, res, next) => {
    await SocialNetwork.create(
        req.body
    ).then(data => {
        res.json({
            code: 0,
            message: messages.CREATE_SUCCESS,
            data: SocialNetwork.transform(data)
        });
    }).catch(ex => {
        ErrorHandler(ex, req, res, next);
    });
};

/**
 * list psot
 *
 * @public
 * @param body as SocialNetWork
 * @returns {Promise<SocialNetwork>, APIError>}
 */
exports.listPost = async (req, res, next) => res.json({
    code: 0,
    data: req.locals.posts
});

/**
 * list page
 *
 * @public
 * @param body as SocialNetWork
 * @returns {Promise<SocialNetwork>, APIError>}
 */
exports.listPage = async (req, res, next) => res.json({
    code: 0,
    data: req.locals.pages
});
/**
 * List
 *
 * @public
 * @param query
 * @returns {Promise<SocialNetWork[]>, APIError>}
 */
exports.list = async (req, res, next) => {
    SocialNetwork.list(
        req.query
    ).then(result => {
        res.json({
            code: 0,
            count: req.totalRecords,
            data: result.map(s => SocialNetwork.transform(s))
        });
    }).catch(ex => {
        ErrorHandler(ex, req, res, next);
    });
};

/**
 * Detail
 *
 * @public
 * @param {String} id
 * @returns {Promise<SocialNetWork>, APIError>}
 */
exports.detail = async (req, res, next) => res.json({ code: 0, data: SocialNetwork.transform(req.locals.socialNetwork) });

/**
 * Update
 *
 * @public
 * @param {String} id
 * @param {SocialNetWork} body
 * @returns {Promise<>, APIError>}
 */
exports.update = async (req, res, next) => {
    const { socialNetwork: data } = req.locals;
    // replace existing data
    return SocialNetwork.update(
        req.body,
        {
            where: {
                id: data.id
            }
        }
    ).then(() => {
        res.json({
            code: 0,
            message: messages.UPDATE_SUCCESS
        });
    }).catch(ex => {
        ErrorHandler(ex, req, res, next);
    });
};

/**
 * Update
 *
 * @public
 * @param {String} id
 * @param {SocialNetWork} body
 * @returns {Promise<>, APIError>}
 */
exports.getPageAccessToken = async (req, res, next) => {
    const { socialNetwork: data } = req.locals;
    // replace existing data
    return SocialNetwork.update(
        req.body,
        {
            where: {
                id: data.id
            }
        }
    ).then(() => {
        res.json({
            code: 0,
            message: messages.UPDATE_SUCCESS
        });
    }).catch(ex => {
        ErrorHandler(ex, req, res, next);
    });
};
/**
 * Delete
 * @public
 * @param {*} id
 * @returns {Promise<, APIError}
 */
exports.delete = async (req, res, next) => {
    const { socialNetwork: data } = req.locals;
    return SocialNetwork.update(
        {
            is_active: false,
            updated_at: new Date()
        },
        {
            where: {
                id: data.id,
                is_active: true
            },
            individualHooks: true,
            user: pick(req.user, ['id', 'name'])
        }
    ).then(() => {
        res.json({
            code: 0,
            message: messages.REMOVE_SUCCESS
        });
    }).catch(error => {
        ErrorHandler(error, req, res, next);
    });
};

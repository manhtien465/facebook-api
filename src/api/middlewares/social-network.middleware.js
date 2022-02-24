import { isNil, omitBy, pick } from 'lodash';
import httpStatus from 'http-status';

import { handler as ErrorHandler } from './error';
import APIError from '../../common/utils/APIError';
import SocialNetwork from '../../common/models/social-network.model';
import SocialNetworkAdapter from '../../common/services/adapters/social-network.adapter';
/**
 * Load order by id appendd to locals.
 */
exports.load = async (req, res, next) => {
    try {
        const { dataValues } = await SocialNetwork.get(req.params.id);
        req.locals = req.locals ? req.locals : {};
        req.locals.socialNetwork = dataValues;
        return next();
    } catch (error) {
        return ErrorHandler(error, req, res, next);
    }
};
/**
 * Load order by id appendd to locals.
 */
exports.loadPost = async (req, res, next) => {
    try {
        const { socialNetwork } = req.locals;
        const data = await SocialNetworkAdapter.getPosts({
            skip: req.query.skip,
            limit: req.query.limit,
            access_token: socialNetwork.secret ? socialNetwork.secret.page_access_token : '',
            page_id: socialNetwork.secret ? socialNetwork.secret.page_id : 0,
        });
        req.locals = req.locals ? req.locals : {};
        req.locals.posts = data;
        return next();
    } catch (error) {
        return ErrorHandler(error, req, res, next);
    }
};
exports.loadPage = async (req, res, next) => {
    try {
        const { socialNetwork } = req.locals;
        const data = await SocialNetworkAdapter.getPages({
            user_id: socialNetwork.secret ? socialNetwork.secret.user_id : '',
            access_token: socialNetwork.secret ? socialNetwork.secret.user_access_token : '',
        });
        req.locals = req.locals ? req.locals : {};
        req.locals.pages = data;
        return next();
    } catch (error) {
        return ErrorHandler(error, req, res, next);
    }
};
exports.loadPageAccessToken = async (req, res, next) => {
    try {
        const { socialNetwork } = req.locals;
        let data = {};
        if (req.body.page_id) {
            data = await SocialNetworkAdapter.getPageAccessTokenFaceebook({
                page_id: req.body.page_id,
                access_token: socialNetwork.secret ? socialNetwork.secret.user_access_token : ''
            });
        }
        console.log('aaa', data);
        const secret = socialNetwork.secret;
        secret.page_access_token = data;

        return next();
    } catch (error) {
        return ErrorHandler(error, req, res, next);
    }
};
exports.loadUser = async (req, res, next) => {
    try {
        const { group } = req.body;
        let data = {};
        switch (group) {
            case SocialNetwork.Groups.FACEBOOK:
                data = await SocialNetworkAdapter.getUserFacebook(req.body);
                break;
            default:
                break;
        }
        req.body.secret = data;
        return next();
    } catch (error) {
        return ErrorHandler(error, req, res, next);
    }
};
/**
 * Load count for filter.
 */
exports.count = async (req, res, next) => {
    try {
        req.totalRecords = await SocialNetwork.totalRecords(
            req.query
        );
        return next();
    } catch (error) {
        return ErrorHandler(error, req, res, next);
    }
};

/**
 * Filter Query append to req query
 */
exports.filterQuery = (req, res, next) => {
    const params = omitBy(req.query, isNil);
    params.system_id = req.headers['x-system-id'];
    req.query = params;
    next();
};

/**
 * Perpare socialNetwork params
 */
exports.prepareParams = async (req, res, next) => {
    try {
        const params = SocialNetwork.filterParams(req.body);
        params.device_id = req.headers['user-agent'];
        params.system_id = req.headers['x-system-id'];
        params.created_by = pick(req.user, ['id', 'name']);


        req.body = params;
        return next();
    } catch (error) {
        return ErrorHandler(error, req, res, next);
    }
};

/**
 * Perpare socialNetwork update
 */
exports.prepareUpdate = async (req, res, next) => {
    try {
        const { socialNetwork: oldModel } = req.locals;
        const params = SocialNetwork.filterParams(
            req.body
        );
        const dataChanged = SocialNetwork.getChangedProperties({
            oldModel,
            newModel: params
        });
        const paramChanged = pick(
            params, dataChanged
        );

        paramChanged.updated_by = pick(req.user, ['id', 'name']);
        paramChanged.updated_at = new Date();
        req.body = paramChanged;
        return next();
    } catch (error) {
        return ErrorHandler(error, req, res, next);
    }
};

/**
 * Perpare socialNetwork update
 */
exports.prepareReplace = async (req, res, next) => {
    try {
        const { socialNetwork } = req.locals;
        if (socialNetwork.status === SocialNetwork.Statuses.FINISHED) {
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'Không thể xử lý chương trình khuyến mãi đã kết thúc'
            });
        }
        return next();
    } catch (error) {
        return ErrorHandler(error, req, res, next);
    }
};


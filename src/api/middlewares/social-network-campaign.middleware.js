import { isNil, omitBy, pick } from 'lodash';
import httpStatus from 'http-status';
import moment from 'moment-timezone';
import { handler as ErrorHandler } from './error';
import APIError from '../../common/utils/APIError';
import SocialNetworkCampaign from '../../common/models/social-network-campaign.model';
import SocialNetworkCampaignApdater from '../../common/services/adapters/social-network-campaign.adapter';

/**
 * Load order by id appendd to locals.
 */
exports.load = async (req, res, next) => {
    try {
        const { dataValues } = await SocialNetworkCampaign.get(req.params.id);
        req.locals = req.locals ? req.locals : {};
        req.locals.socialNetworkCampaign = dataValues;
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
        req.totalRecords = await SocialNetworkCampaign.totalRecords(
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
        const params = SocialNetworkCampaign.filterParams(req.body);
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
        const params = SocialNetworkCampaign.filterParams(
            req.body
        );
        const dataChanged = SocialNetworkCampaign.getChangedProperties({
            oldModel,
            newModel: params
        });
        const paramChanged = pick(
            params, dataChanged
        );
        if (paramChanged.applied_items) {
            paramChanged.applied_items = await SocialNetworkCampaignApdater.parseItems(
                paramChanged.applied_items
            );
        }
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
        const { socialNetworkCampaign } = req.locals;
        if (socialNetworkCampaign.status === SocialNetworkCampaign.Statuses.FINISHED) {
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


/**
 * Check time create campaign
 */
exports.checkTimeCreate = async (req, res, next) => {
    try {
        const dateNow = new Date();
        const { applied_start_time, applied_stop_time } = req.body;
        if (
            applied_start_time &&
            moment(applied_start_time).diff(dateNow, 'minutes') < 60
        ) {
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'Vui lòng nhập thời gian bắt đầu sau ít nhất 1 giờ so với thời gian hiện tại'
            });
        }
        if (
            applied_stop_time &&
            moment(applied_stop_time).diff(applied_start_time, 'minutes') < 60
        ) {
            console.log('aaaa', moment(applied_stop_time).diff(applied_start_time, 'minutes'));
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'Chương trình phải kéo dài ít nhất là 1h kể từ khi bắt đầu'
            });
        }
        return next();
    } catch (error) {
        return ErrorHandler(error, req, res, next);
    }
};

/**
 * Perpare check time campaign update
 */
exports.checkTimeUpdate = async (req, res, next) => {
    try {
        const { socialNetworkCampaign } = req.locals;
        const { applied_start_time, applied_stop_time } = req.body;
        if (
            applied_start_time &&
            moment(applied_start_time).diff(socialNetworkCampaign.applied_start_time, 'minutes') < 0
        ) {
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'Thời gian kết thúc chương trình chỉ có thể được thay đổi thành thời gian muộn hơn'
            });
        }
        if (
            applied_stop_time &&
            moment(applied_stop_time).diff(applied_start_time || socialNetworkCampaign.applied_start_time, 'minutes') < 60
        ) {
            console.log('bbbb', moment(applied_stop_time).diff(applied_start_time, 'minutes'));
            console.log(moment(applied_stop_time));
            console.log(moment(applied_start_time));
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'Chương trình phải kéo dài ít nhất là 1h kể từ khi bắt đầu'
            });
        }
        return next();
    } catch (error) {
        return ErrorHandler(error, req, res, next);
    }
};

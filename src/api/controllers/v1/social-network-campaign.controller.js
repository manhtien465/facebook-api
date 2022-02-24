import { pick } from 'lodash';

import messages from '../../../config/messages';
import { handler as ErrorHandler } from '../../middlewares/error';
import SocialNetworkCampaign from '../../../common/models/social-network-campaign.model';

/**
 * Create
 *
 * @public
 * @param body as SocialNetWork
 * @returns {Promise<SocialNetWork>, APIError>}
 */
exports.create = async (req, res, next) => {
    await SocialNetworkCampaign.create(
        req.body
    ).then(data => {
        res.json({
            code: 0,
            message: messages.CREATE_SUCCESS,
            data: SocialNetworkCampaign.transform(data)
        });
    }).catch(ex => {
        ErrorHandler(ex, req, res, next);
    });
};

/**
 * List
 *
 * @public
 * @param query
 * @returns {Promise<SocialNetworkCampaign[]>, APIError>}
 */
exports.list = async (req, res, next) => {
    SocialNetworkCampaign.list(
        req.query
    ).then(result => {
        res.json({
            code: 0,
            count: req.totalRecords,
            data: result.map(s => SocialNetworkCampaign.transform(s))
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
 * @returns {Promise<SocialNetworkCampaign>, APIError>}
 */
exports.detail = async (req, res, next) => res.json({ code: 0, data: SocialNetworkCampaign.transform(req.locals.socialNetworkCampaign) });

/**
 * Update
 *
 * @public
 * @param {String} id
 * @param {SocialNetworkCampaign} body
 * @returns {Promise<>, APIError>}
 */
exports.update = async (req, res, next) => {
    const { socialNetworkCampaign: data } = req.locals;
    // replace existing data
    return SocialNetworkCampaign.update(
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
    const { socialNetworkCampaign: data } = req.locals;
    return SocialNetworkCampaign.update(
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

/**
  * Block
  *
  * @public
  * @param {String} id
  * @param {Campaign} body
  * @returns {Promise<null, APIError>}
  */
exports.block = async (req, res, next) => {
    const { socialNetworkCampaign } = req.locals;

    return SocialNetworkCampaign.update(
        {
            status: SocialNetworkCampaign.Statuses.STOPPING,
            status_name: SocialNetworkCampaign.NameStatuses.STOPPING,
            updated_by: pick(req.user, ['id', 'name']),
            updated_at: new Date()
        },
        {
            where: {
                id: socialNetworkCampaign.id,
                is_active: true
            },
            individualHooks: true,
        }
    ).then(data => {
        res.json({
            code: 0,
            data: data[0][1],
            message: 'Đã tạm dừng chương trình khuyến mại'
        });
    }).catch(error => {
        ErrorHandler(error, req, res, next);
    });
};

/**
  * Active
  *
  * @public
  * @param {String} id
  * @param {Campaign} body
  * @returns {Promise<>, APIError>}
  */
exports.active = async (req, res, next) => {
    const { socialNetworkCampaign } = req.locals;

    return SocialNetworkCampaign.update(
        {
            status: SocialNetworkCampaign.Statuses.STARTING,
            status_name: SocialNetworkCampaign.NameStatuses.STARTING,
            updated_by: pick(req.user, ['id', 'name']),
            updated_at: new Date()
        },
        {
            where: {
                id: socialNetworkCampaign.id,
                is_active: true
            },
            individualHooks: true,
        }
    ).then(data => {
        res.json({
            code: 0,
            data: data[0][1],
            message: 'Đã kích hoạt chương trình khuyến mại'
        });
    }).catch(error => {
        ErrorHandler(error, req, res, next);
    });
};

/**
  * Finish
  *
  * @public
  * @param {String} id
  * @param {Campaign} body
  * @returns {Promise<Campaign, APIError>}
  */
exports.finish = async (req, res, next) => {
    const { socialNetworkCampaign } = req.locals;
    return SocialNetworkCampaign.update(
        {
            status: SocialNetworkCampaign.Statuses.FINISHED,
            status_name: SocialNetworkCampaign.NameStatuses.FINISHED,
            updated_by: pick(req.user, ['id', 'name']),
            updated_at: new Date()
        },
        {
            where: {
                id: socialNetworkCampaign.id,
                is_active: true
            },
            individualHooks: true,
        }
    ).then(data => {
        res.json({
            code: 0,
            data: data[0][1],
            message: 'Đã kết thúc chương trình khuyến mại'
        });
    }).catch(error => {
        ErrorHandler(error, req, res, next);
    });
};

/**
  * Cancel
  *
  * @public
  * @param {String} id
  * @param {Campaign} body
  * @returns {Promise<>, APIError>}
  */
exports.cancel = async (req, res, next) => {
    const { socialNetworkCampaign } = req.locals;
    return SocialNetworkCampaign.update(
        {
            status: SocialNetworkCampaign.Statuses.CANCELLED,
            status_name: SocialNetworkCampaign.NameStatuses.CANCELLED,
            updated_by: pick(req.user, ['id', 'name']),
            updated_at: new Date()
        },
        {
            where: {
                id: socialNetworkCampaign.id,
                is_active: true
            },
            individualHooks: true,
        }
    ).then(data => {
        res.json({
            code: 0,
            data: data[0][1],
            message: 'Đã huỷ chương trình khuyến mại'
        });
    }).catch(error => {
        ErrorHandler(error, req, res, next);
    });
};

import Joi from 'joi';
import { values } from 'lodash';
import SocialNetwork from '../../common/models/social-network.model';

module.exports = {
    listValidation: {
        query: {
            // pagging
            skip: Joi.number()
                .min(0)
                .allow(null, ''),
            limit: Joi.number()
                .min(1)
                .max(10000)
                .allow(null, ''),
            sort_by: Joi.string()
                .only([
                    'created_at',
                    'updated_at'
                ])
                .allow(null, ''),
            order_by: Joi.string()
                .only([
                    'desc',
                    'asc'
                ])
                .allow(null, ''),

            // search
            group: Joi.string()
                .only(values(SocialNetwork.Groups))
                .allow(null, ''),
            name: Joi.string()
                .trim()
                .allow(null, ''),
            statuses: Joi.string()
                .trim()
                .allow(null, '')
        }
    },

    // POST v1/provider-services
    createValidation: {
        body: {
            name: Joi.string()
                .max(100)
                .trim()
                .required(),
            group: Joi.string()
                .trim()
                .only(values(SocialNetwork.Groups))
                .error(() => ({ message: 'Vui lòng chọn đúng loại chương trình' }))
                .required(),
            secret: Joi.object()
                .default({}),
            thumbnail_url: Joi.string()
                .allow(null, ''),
            status: Joi.string()
                .trim()
                .only(values(SocialNetwork.Statuses))
                .default(SocialNetwork.Statuses.PENDING),
            status_name: Joi.string()
                .trim()
                .only(values(SocialNetwork.NameStatuses))
                .default(SocialNetwork.NameStatuses.PENDING),
        }
    },

    // POST v1/provider-services
    updateValidation: {
        body: {
            name: Joi.string()
                .max(100)
                .trim()
                .allow(null, ''),
            group: Joi.string()
                .trim()
                .only(values(SocialNetwork.Groups))
                .allow(null, ''),
            secret: Joi.object()
                .allow(null, ''),
            status: Joi.string()
                .trim()
                .only(values(SocialNetwork.Statuses))
                .allow(null, ''),
            status_name: Joi.string()
                .trim()
                .only(values(SocialNetwork.NameStatuses))
                .allow(null, '')
        }
    },
};

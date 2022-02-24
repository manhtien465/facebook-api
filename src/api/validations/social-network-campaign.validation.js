import Joi from 'joi';
import { values } from 'lodash';
import SocialNetworkCampaign from '../../common/models/social-network-campaign.model';

const itemSchema = {
    id: Joi.number()
        .integer()
        .required(),
    sku: Joi.string()
        .allow(null, ''),
    option_name: Joi.string()
        .allow(null, ''),
    normal_price: Joi.number()
        .integer(),
    original_price: Joi.number()
        .integer(),
    price: Joi.number()
        .integer(),
    keyword: Joi.string()
};

module.exports = {
    listValidation: {
        query: {
            skip: Joi.number()
                .min(0)
                .default(0),
            limit: Joi.number()
                .min(1)
                .max(10000)
                .default(20),
            sort_by: Joi.string()
                .trim()
                .allow(null, ''),
            order_by: Joi.string()
                .only([
                    'desc',
                    'asc'
                ])
                .allow(null, ''),
            min_created_at: Joi.date()
                .allow(null, ''),
            max_created_at: Joi.date()
                .allow(null, ''),
            min_start_time: Joi.date()
                .allow(null, ''),
            max_start_time: Joi.date()
                .allow(null, ''),
            product_name: Joi.string()
                .trim()
                .allow(null, ''),
            product_sku: Joi.string()
                .trim()
                .allow(null, ''),
            status: Joi.string()
                .trim()
                .allow(null, ''),
            keyword: Joi.string()
                .trim()
                .allow(null, ''),
        },
    },

    // POST v1/social-network-campaign
    createValidation: {
        body: {
            name: Joi.string()
                .max(155)
                .trim()
                .required()
                .error(() => ({ message: 'Vui lòng nhập tên chương trình tối đa 155 ký tự' })),
            type: Joi.string()
                .required()
                .only(values(SocialNetworkCampaign.Types))
                .error(() => ({ message: 'Vui lòng chọn đúng loại chương trình' })),
            post_id: Joi.string()
                .required(),
            content: Joi.string()
                .max(255)
                .error(() => ({ message: 'Vui lòng nhập nội dung chương trình tối đa 255 ký tự' })),
            position: Joi.number()
                .allow(null, ''),
            social_network_id: Joi.number()
                .required()
                .error(() => ({ message: 'Vui lòng chọn nền tảng' })),
            thumbnail_url: Joi.string()
                .max(255)
                .allow(null, '')
                .error(() => ({ message: 'Ảnh đại diện chỉ được phép chọn tối đa 255 ký tự' })),
            applied_items: Joi.array()
                .min(1)
                .required()
                .items(itemSchema)
                .error(() => ({ message: 'Vui lòng chọn sản phẩm chính' })),
            applied_start_time: Joi.date()
                .required()
                .error(() => ({ message: 'Vui lòng chọn đúng định dạng thời gian' })),
            applied_stop_time: Joi.date()
                .required()
                .error(() => ({ message: 'Vui lòng chọn đúng định dạng thời gian' })),

        }
    },

    // POST v1/social-network-campaign
    updateValidation: {
        body: {
            name: Joi.string()
                .max(155)
                .trim()
                .required()
                .error(() => ({ message: 'Vui lòng nhập tên chương trình tối đa 155 ký tự' })),
            type: Joi.string()
                .required()
                .only(values(SocialNetworkCampaign.Types))
                .error(() => ({ message: 'Vui chọn đúng loại chương trình' })),
            content: Joi.string()
                .max(255)
                .error(() => ({ message: 'Vui lòng nhập nội dung chương trình tối đa 255 ký tự' })),
            position: Joi.number()
                .allow(null, ''),
            thumbnail_url: Joi.string()
                .max(255)
                .allow(null, '')
                .error(() => ({ message: 'Ảnh đại diện chỉ được phép chọn tối đa 255 ký tự' })),
            applied_items: Joi.array()
                .min(1)
                .required()
                .items(itemSchema)
                .error(() => ({ message: 'Vui lòng chọn sản phẩm chính' })),
            applied_start_time: Joi.date()
                .required()
                .error(() => ({ message: 'Vui lòng chọn đúng định dạng thời gian' })),
            applied_stop_time: Joi.date()
                .required()
                .error(() => ({ message: 'Vui lòng chọn đúng định dạng thời gian' })),
        }
    },
};

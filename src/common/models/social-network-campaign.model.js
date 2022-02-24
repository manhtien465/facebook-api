/* eslint-disable no-param-reassign */
import httpStatus from 'http-status';
import { Model, DataTypes, Op } from 'sequelize';

import { pick, isEqual, values, omitBy, isNil, isUndefined } from 'lodash';
import moment from 'moment-timezone';

import postgres from '../../config/postgres';
import { serviceName } from '../../config/vars';
import APIError from '../utils/APIError';
import eventBus from '../services/event-bus';

/**
 * Promotion Schema
 * @public
 */
class SocialNetworkCampaign extends Model { }
const { sequelize } = postgres;

const PUBLIC_FIELDS = [
    'name',
    'type',
    'content',
    'position',
    'post_id',
    'message',
    'status',
    'status_name',
    'thumbnail_url',
    'applied_items',
    'applied_options',
    'applied_stop_time',
    'applied_start_time',
];

SocialNetworkCampaign.Types = {
    POST: 'post',
    LIVE_STREAM: 'live_stream'
};

SocialNetworkCampaign.Statuses = {
    DRAFT: 'draft',
    PENDING: 'pending',
    STARTING: 'starting',
    STOPPING: 'stopping',
    FINISHED: 'finished',
    FAILURED: 'failured',
    CANCELLED: 'cancelled'
};

SocialNetworkCampaign.NameStatuses = {
    DRAFT: 'Lưu tạm',
    PENDING: 'Sắp diễn ra',
    STARTING: 'Đang diễn ra',
    STOPPING: 'Đang tạm dừng',
    FINISHED: 'Đã kết thúc',
    FAILURED: 'Đã gặp sự cố',
    CANCELLED: 'Đã huỷ'
};

/**
 * Init Schema
 */
SocialNetworkCampaign.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING(50),
            values: values(SocialNetworkCampaign.Types),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(155),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        position: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        social_network_id: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        status: {
            type: DataTypes.STRING(10),
            values: values(SocialNetworkCampaign.Statuses),
            defaultValue: SocialNetworkCampaign.Statuses.PENDING
        },
        status_name: {
            type: DataTypes.STRING(50),
            values: values(SocialNetworkCampaign.NameStatuses),
            defaultValue: SocialNetworkCampaign.NameStatuses.PENDING
        },
        thumbnail_url: {
            // name: 'Hình ảnh quảng cáo'
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        applied_items: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        post_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        message: {
            type: DataTypes.TEXT,
            defaultValue:
                `Chúc mừng bạn đặt thành công $products. 
                 Cảm ơn bạn đã mua sắm cùng chúng tôi `
        },
        applied_start_time: {
            // name: 'Thời gian bắt đầu'
            type: DataTypes.DATE,
            allowNull: false
        },
        applied_stop_time: {
            // name: 'Thời gian kết thúc'
            type: DataTypes.DATE,
            allowNull: false
        },
        // applied_min_quantity: {
        //     // name: 'Số lượng tối thiểu'
        //     type: DataTypes.DECIMAL,
        //     defaultValue: null
        // },
        // applied_max_quantity: {
        //     // name: 'Số lượng tối đa'
        //     type: DataTypes.DECIMAL,
        //     defaultValue: null
        // },

        // manager
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        is_visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        is_warning: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        device_id: {
            type: DataTypes.STRING(255),
            defaultValue: 'unkown'
        },
        device_ip: {
            type: DataTypes.STRING(12),
            defaultValue: 'unkown'
        },
        system_id: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        created_by: {
            type: DataTypes.JSONB,
            defaultValue: null
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_by: {
            type: DataTypes.JSONB,
            defaultValue: null
        },
        cancelled_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        cancelled_by: {
            type: DataTypes.JSONB,
            defaultValue: null
        }
    },
    {
        timestamps: false,
        sequelize: sequelize,
        schema: serviceName,
        modelName: 'social_network_campaigns',
        tableName: 'tbl_social_network_campaigns'
    }
);

/**
 * Register event emiter
 */
SocialNetworkCampaign.Events = {
    SOCIAL_NETWORK_CAMPAIGN_CREATED: `${serviceName}.SocialNetworkCampaign.created`,
    SOCIAL_NETWORK_CAMPAIGN_UPDATED: `${serviceName}.SocialNetworkCampaign.updated`,
    SOCIAL_NETWORK_CAMPAIGN_DELETED: `${serviceName}.SocialNetworkCampaign.deleted`
};
SocialNetworkCampaign.EVENT_SOURCE = `${serviceName}.SocialNetworkCampaign`;

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
SocialNetworkCampaign.addHook('afterUpdate', (data) => {
    eventBus.emit(SocialNetworkCampaign.Events.SOCIAL_NETWORK_CAMPAIGN_CREATED, data);
});

SocialNetworkCampaign.addHook('afterUpdate', (data) => {
    eventBus.emit(SocialNetworkCampaign.Events.SOCIAL_NETWORK_CAMPAIGN_UPDATED, data);
});

SocialNetworkCampaign.addHook('afterDestroy', (data) => {
    eventBus.emit(SocialNetworkCampaign.Events.SOCIAL_NETWORK_CAMPAIGN_DELETED, data);
});

/**
 * Check min or max in condition
 * @param {*} options
 * @param {*} field
 * @param {*} type
 */
function checkMinMaxOfConditionFields(options, field, type) {
    console.log(field, type);
    let _min = null;
    let _max = null;

    // Transform min max
    if (type === 'Date') {
        _min = new Date(options[`min_${field}`]);
        _min.setHours(0, 0, 0, 0);

        _max = new Date(options[`max_${field}`]);
        _max.setHours(23, 59, 59, 999);
    } else {
        _min = parseFloat(options[`min_${field}`]);
        _max = parseFloat(options[`max_${field}`]);
    }

    // Transform condition
    if (
        !isNil(options[`min_${field}`]) ||
        !isNil(options[`max_${field}`])
    ) {
        if (
            options[`min_${field}`] &&
            !options[`max_${field}`]
        ) {
            options[field] = {
                [Op.gte]: _min
            };
        } else if (
            !options[`min_${field}`] &&
            options[`max_${field}`]
        ) {
            options[field] = {
                [Op.lte]: _max
            };
        } else {
            options[field] = {
                [Op.gte]: _min || 0,
                [Op.lte]: _max || 0
            };
        }
    }
    // console.log(options[`max_${field}`]);
    // Remove first condition
    delete options[`max_${field}`];
    delete options[`min_${field}`];
}

/**
 * Load query
 * @param {*} params
 */
function filterConditions(params) {
    const options = omitBy(params, isNil);
    options.is_active = true;

    if (options.system_id) {
        options.system_id = options.system_id;
    }

    if (options.type) {
        options.type = {
            [Op.like]: `${options.type}`
        };
    }
    if (options.post_id) {
        options.post_id = `${options.post_id}`;
    }
    if (options.keyword) {
        options.name = {
            name: { [Op.iLike]: `%${options.keyword}%` }
        };
    }
    delete options.keyword;

    if (options.product_sku) {
        options.applied_items = {
            [Op.contains]: [
                {
                    sku: options.product_sku
                }
            ]
        };
    }
    delete options.product_sku;

    if (options.product_name) {
        options.applied_items = {
            [Op.contains]: [
                {
                    name: options.product_name
                }
            ]
        };
    }
    delete options.product_name;

    if (options.min_start_time) {
        options.applied_stop_time = {
            [Op.gte]: options.min_start_time
        };
    }
    delete options.min_start_time;

    if (options.max_start_time) {
        options.applied_start_time = {
            [Op.lte]: options.max_start_time
        };
    }
    delete options.max_start_time;

    if (options.statuses) {
        options.status = {
            [Op.in]: options.statuses.split(',')
        };
    }
    delete options.statuses;

    // date filters
    checkMinMaxOfConditionFields(options, 'created_at', 'Date');
    checkMinMaxOfConditionFields(options, 'applied_stop_time', 'Date');
    checkMinMaxOfConditionFields(options, 'applied_start_time', 'Date');

    return options;
}

/**
 * Load sort query
 * @param {*} sort_by
 * @param {*} order_by
 */
function sortConditions({ sort_by, order_by }) {
    let sort = null;
    switch (sort_by) {
        case 'name':
            sort = ['name', order_by];
            break;
        case 'position':
            sort = ['position', order_by];
            break;
        case 'created_at':
            sort = ['created_at', order_by];
            break;
        case 'updated_at':
            sort = ['updated_at', order_by];
            break;
        default: sort = ['created_at', 'DESC'];
            break;
    }
    return sort;
}

/**
 * Transform postgres model to expose object
 */
SocialNetworkCampaign.transform = (params, includeRestrictedFields = true) => {
    const transformed = {};
    const fields = [
        'id',
        'name',
        'type',
        'content',
        'position',
        'post_id',
        'message',
        'status',
        'status_name',
        'thumbnail_url',
        'applied_items',
        'applied_options',
        'applied_min_value',
        'applied_max_value',
        'applied_min_quantity',
        'applied_max_quantity',
        'applied_stop_time',
        'applied_start_time',
        'created_by',
        'created_at',
        'updated_by',
        'updated_at'
    ];
    fields.forEach((field) => {
        transformed[field] = params[field];
    });

    if (includeRestrictedFields) {
        const privateFields = [
            'secret'
        ];
        privateFields.forEach((field) => {
            transformed[field] = params[field];
        });
    }


    // pipe date
    const dateFields = [
        'created_at',
        'updated_at',
        'applied_stop_time',
        'applied_start_time'
    ];
    dateFields.forEach((field) => {
        if (params[field]) {
            transformed[field] = moment(params[field]).unix();
        } else {
            transformed[field] = null;
        }
    });

    return transformed;
};

/**
 * Get all changed properties
 */
SocialNetworkCampaign.getChangedProperties = ({ newModel, oldModel }) => {
    const changedProperties = [];
    const allChangableProperties = [
        'name',
        'type',
        'content',
        'position',
        'status',
        'status_name',
        'thumbnail_url',
        'applied_items',
        'applied_options',
        'applied_stop_time',
        'applied_start_time',
        // 'applied_min_value',
        // 'applied_max_value',
        // 'applied_min_quantity',
        // 'applied_max_quantity',
    ];
    if (!oldModel) {
        return allChangableProperties;
    }

    allChangableProperties.forEach((field) => {
        if (
            !isUndefined(newModel[field]) &&
            !isEqual(newModel[field], oldModel[field])
        ) {
            changedProperties.push(field);
        }
    });

    return changedProperties;
};

/**
 * Get SocialNetworkCampaign By Id
 *
 * @public
 * @param {String} id
 */
SocialNetworkCampaign.get = async (id) => {
    try {
        const socialNetworkCampaign = await SocialNetworkCampaign.findByPk(
            id
        );
        if (!socialNetworkCampaign) {
            throw new APIError({
                status: httpStatus.NOT_FOUND,
                message: `Không tìm thấy chương trình khuyến mại: ${id}`
            });
        }
        return socialNetworkCampaign;
    } catch (error) {
        throw (error);
    }
};

/**
 * List records in descending order of 'createdAt' timestamp.
 *
 * @param {number} skip - Number of records to be skipped.
 * @param {number} limit - Limit number of records to be returned.
 * @returns {Promise<Supplider[]>}
 */
SocialNetworkCampaign.list = async ({
    // page
    sort_by,
    order_by,
    skip = 0,
    limit = 20,

    // query
    type,
    status,
    keyword,
    post_id,
    system_id,
    is_active,
    is_visible,
    product_sku,
    product_name,
    min_created_at,
    max_created_at,
    min_start_time,
    max_start_time,
}) => {
    const options = filterConditions({
        type,
        status,
        keyword,
        system_id,
        post_id,
        is_active,
        is_visible,
        product_sku,
        product_name,
        min_created_at,
        max_created_at,
        min_start_time,
        max_start_time,
    });
    const sort = sortConditions({
        sort_by,
        order_by
    });
    return SocialNetworkCampaign.findAll({
        attributes: [
            'id',
            'name',
            'type',
            'content',
            'position',
            'post_id',
            'message',
            'status',
            'status_name',
            'thumbnail_url',
            'applied_items',
            'applied_options',
            'applied_stop_time',
            'applied_start_time',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at'
        ],
        where: options,
        order: [sort],
        offset: skip,
        limit: limit
    });
};

/**
 * Total records.
 *
 * @param {number} skip - Number of records to be skipped.
 * @param {number} limit - Limit number of records to be returned.
 * @returns {Promise<Number>}
 */
SocialNetworkCampaign.totalRecords = ({
    type,
    status,
    keyword,
    system_id,
    post_id,
    is_active,
    is_visible,
    product_sku,
    product_name,
    min_created_at,
    max_created_at,
    min_start_time,
    max_start_time,
}) => {
    const options = filterConditions({
        type,
        status,
        keyword,
        system_id,
        post_id,
        is_active,
        is_visible,
        product_sku,
        product_name,
        min_created_at,
        max_created_at,
        min_start_time,
        max_start_time,
    });
    return SocialNetworkCampaign.count({ where: options });
};

/**
 * Check Valid
 *
 * @public
 */
SocialNetworkCampaign.checkValid = (operation) => !!operation;

/**
 * Filter only allowed fields from SocialNetworkCampaign
 * @param {Object} params
 */
SocialNetworkCampaign.filterParams = (params) => pick(params, PUBLIC_FIELDS);

/**
 * @typedef SocialNetworkCampaign
 */
export default SocialNetworkCampaign;

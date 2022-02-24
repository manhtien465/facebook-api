/* eslint-disable no-param-reassign */
import httpStatus from 'http-status';
import { Model, DataTypes, Op } from 'sequelize';
import { isEqual, isNil, isUndefined, omitBy, pick, values } from 'lodash';
import moment from 'moment-timezone';

import APIError from '../utils/APIError';
import postgres from '../../config/postgres';
import eventBus from '../services/event-bus';
import { serviceName } from '../../config/vars';

/**
 * Create connection
 */
class ProviderServiceHistory extends Model { }
const { sequelize } = postgres;

const PUBLIC_FIELDS = [
    'group',
    'provider',
    'transaction',
    'status_name',
    'status',
];

ProviderServiceHistory.Statuses = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILURE: 'failure'
};

ProviderServiceHistory.NameStatuses = {
    PENDING: 'Đang xử lý',
    SUCCESS: 'Xử lý thành công',
    FAILURE: 'Xử lý thất bại'
};

ProviderServiceHistory.Groups = {
    TIKTOK: 'tiktok',
    FACEBOOK: 'facebook',
    INSTAGRAM: 'instagram'
};

/**
 * Delivery Service Schema
 * @public
 */
ProviderServiceHistory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        group: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        social_network_campaign_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transaction: {
            // field: 'id, code'
            type: DataTypes.JSONB,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(10),
            values: values(ProviderServiceHistory.Statuses),
            defaultValue: ProviderServiceHistory.Statuses.PENDING,
        },
        status_name: {
            type: DataTypes.STRING(50),
            values: values(ProviderServiceHistory.NameStatuses),
            defaultValue: ProviderServiceHistory.NameStatuses.PENDING,
        },

        // manager
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_by: {
            type: DataTypes.JSONB,
            defaultValue: null
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        created_by: {
            type: DataTypes.JSONB,
            defaultValue: null
        }
    },
    {
        timestamps: false,
        sequelize: sequelize,
        schema: serviceName,
        modelName: 'provider_service_history',
        tableName: 'tbl_provider_service_histories'
    }
);

/**
 * Register event emiter
 */
ProviderServiceHistory.Events = {
    PROVIDER_SERVICE_HISTORY_CREATED: `${serviceName}.provider-service-history.created`,
    PROVIDER_SERVICE_HISTORY_UPDATED: `${serviceName}.provider-service-history.updated`,
    PROVIDER_SERVICE_HISTORY_DELETED: `${serviceName}.provider-service-history.deleted`
};
ProviderServiceHistory.EVENT_SOURCE = `${serviceName}.provider-service-history`;

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
ProviderServiceHistory.addHook('afterCreate', (model) => {
    eventBus.emit(ProviderServiceHistory.Events.PROVIDER_SERVICE_HISTORY_CREATED, model);
});

ProviderServiceHistory.addHook('afterUpdate', (model) => {
    eventBus.emit(ProviderServiceHistory.Events.PROVIDER_SERVICE_HISTORY_UPDATED, model);
});

ProviderServiceHistory.addHook('afterDestroy', (model) => {
    eventBus.emit(ProviderServiceHistory.Events.PROVIDER_SERVICE_HISTORY_DELETED, model);
});

/**
 * Check min or max in condition
 * @param {*} options
 * @param {*} field
 * @param {*} type
 */
function checkMinMaxOfConditionFields(options, field, type = 'Number') {
    let _min = null;
    let _max = null;

    // Transform min max
    if (type === 'Date') {
        _min = new Date(options[`min_${field}`]);
        _min.setHours(0, 0, 0, 0);

        _max = new Date(options[`max_${field}`]);
        _max.setHours(23, 59, 59, 999);
    } else if (type === 'Time') {
        _min = new Date(options[`min_${field}`]);
        _min = _min.setHours(_min.getHours(), _min.getMinutes(), 0, 0);

        _max = new Date(options[`max_${field}`]);
        _max = _max.setHours(_max.getHours(), _max.getMinutes(), 59, 999);
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

    if (options.order_types) {
        options['transaction.operation.order.type'] = {
            [Op.in]: options.order_types.split(',')
        };
    }
    delete options.order_types;

    if (options.order_code) {
        options['transaction.operation.order.code'] = {
            [Op.iLike]: `%${options.order_code}%`
        };
    }
    delete options.order_code;

    if (options.order_customer) {
        options[Op.or] = [
            {
                'transaction.operation.order.customer.name': {
                    [Op.iLike]: `%${options.order_customer}%`
                }
            },
            {
                'transaction.operation.order.customer.phone': {
                    [Op.iLike]: `%${options.order_customer}%`
                }
            }
        ];
    }
    delete options.order_customer;

    if (options.order_stores) {
        options['transaction.operation.order.store.id'] = {
            [Op.in]: options.order_stores.split(',')
        };
    }
    delete options.order_stores;

    if (options.order_channels) {
        options['transaction.operation.order.channel.name'] = {
            [Op.in]: options.order_channels.split(',')
        };
    }
    delete options.order_channels;

    if (options.statuses) {
        options.status = {
            [Op.in]: options.statuses.split(',')
        };
    }
    delete options.statuses;

    // date range
    checkMinMaxOfConditionFields(options, 'created_at', 'Date');

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
ProviderServiceHistory.transform = (params) => {
    const transformed = {};
    const fields = [
        'id',
        'group',
        'provider',
        'transaction',
        'status_name',
        'status',
        'created_by',
        'updated_by',
    ];
    fields.forEach((field) => {
        transformed[field] = params[field];
    });

    // pipe date
    const dateFields = [
        'created_at',
        'updated_at'
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
ProviderServiceHistory.getChangedProperties = ({ newModel, oldModel }) => {
    const changedProperties = [];
    const allChangableProperties = [
        'status',
        'status_name'
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
 * Detail
 *
 * @public
 * @param {string} id
 */
ProviderServiceHistory.get = async (id) => {
    try {
        const data = await ProviderServiceHistory.findOne({
            where: {
                id,
                is_active: true
            }
        });
        if (!data) {
            throw new APIError({
                status: httpStatus.NOT_FOUND,
                message: 'Không tìm thấy giao dịch này'
            });
        }
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * List records in descending order of 'createdAt' timestamp.
 *
 * @param {number} skip - Number of records to be skipped.
 * @param {number} limit - Limit number of records to be returned.
 * @returns {Promise<Supplider[]>}
 */
ProviderServiceHistory.list = async ({
    group,
    statuses,
    order_types,
    order_code,
    order_customer,
    order_stores,
    order_channels,

    // page
    sort_by,
    order_by,
    skip = 0,
    limit = 50,
}) => {
    const options = filterConditions({
        group,
        statuses,
        order_types,
        order_code,
        order_customer,
        order_stores,
        order_channels,
    });
    const sort = sortConditions({ sort_by, order_by });
    return ProviderServiceHistory.findAll({
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
ProviderServiceHistory.totalRecords = ({
    group,
    statuses,
    order_types,
    order_code,
    order_customer,
    order_stores,
    order_channels,
}) => {
    const options = filterConditions({
        group,
        statuses,
        order_types,
        order_code,
        order_customer,
        order_stores,
        order_channels,
    });
    return ProviderServiceHistory.count({ where: options });
};

// check Code Webhook for Shopee
ProviderServiceHistory.checkCodeWebhookShopee = async (shopId, code, group) => {
    try {
        const providerCheckCode = await ProviderServiceHistory.findOne({
            where: {
                group,
                is_active: true,
                'transaction.payload.shop_id': shopId,
                'transaction.payload.code': code,
            }
        });
        return providerCheckCode;
    } catch (ex) {
        throw ex;
    }
};

/**
 * Filter only allowed fields from ProviderServiceHistory
 *
 * @param {Object} params
 */
ProviderServiceHistory.filterParams = (params) => pick(params, PUBLIC_FIELDS);

/**
 * @typedef ProviderServiceHistory
 */
export default ProviderServiceHistory;

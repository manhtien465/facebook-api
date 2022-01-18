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
class ProviderService extends Model { }
const { sequelize } = postgres;

const PUBLIC_FIELDS = [
    'name',
    'group',
    'secret',
    'status',
    'status_name'
];

ProviderService.Groups = {
    GHN: 'ghn',
    GHTK: 'ghtk',
    AHAMOVE: 'ahamove',
    ZALO: 'zalo',
    APPLE: 'apple',
    FACEBOOK: 'facebook',
    GOOGLE: 'google',
    VNPAY: 'vnpay',
    MOMO: 'momo',
    SHOPEE: 'shopee'
};

ProviderService.Statuses = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILURE: 'failure',
    // CHECK_PRODUCT: 'check_product'
};

ProviderService.NameStatuses = {
    ACTIVE: 'Đang hoạt động',
    INACTIVE: 'Ngừng hoạt động',
    PENDING: 'Đang xử lý',
    SUCCESS: 'Xử lý thành công',
    FAILURE: 'Xử lý thất bại',
    // CHECK_PRODUCT: 'Kiểm tra sản phẩm'
};

ProviderService.SecretStatuses = {
    CHECK_PRODUCT: 'check_product',
    SUCCESS_PRODUCT: 'success_product'
};

ProviderService.SecretNameStatuses = {
    CHECK_PRODUCT: 'Kiểm tra sản phẩm',
    SUCCESS_PRODUCT: 'Thành công sản phẩm'
};


/**
 * Provider Service Schema
 * @public
 */
ProviderService.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        group: {
            type: DataTypes.STRING(50),
            values: values(ProviderService.Groups),
            allowNull: false
        },
        secret: {
            // gồm các app_id, token, secret ... tùy vào từng đối tác
            type: DataTypes.JSONB,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(50),
            values: values(ProviderService.Statuses),
            allowNull: false
        },
        status_name: {
            type: DataTypes.STRING(100),
            values: values(ProviderService.NameStatuses),
            allowNull: false
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
        modelName: 'provider_service',
        tableName: 'tbl_provider_services'
    }
);

/**
 * Register event emiter
 */
ProviderService.Events = {
    PROVIDER_SERVICE_CREATED: `${serviceName}.provider-service.created`,
    PROVIDER_SERVICE_UPDATED: `${serviceName}.provider-service.updated`,
    PROVIDER_SERVICE_DELETED: `${serviceName}.provider-service.deleted`,
};
ProviderService.EVENT_SOURCE = `${serviceName}.provider-service`;

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
ProviderService.addHook('afterCreate', (model) => {
    eventBus.emit(ProviderService.Events.PROVIDER_SERVICE_CREATED, model);
});

ProviderService.addHook('afterUpdate', (model) => {
    eventBus.emit(ProviderService.Events.PROVIDER_SERVICE_UPDATED, model);
});

ProviderService.addHook('afterDestroy', (model) => {
    eventBus.emit(ProviderService.Events.PROVIDER_SERVICE_DELETED, model);
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
    options.status = ProviderService.Statuses.SUCCESS;

    if (options.name) {
        options.name = {
            [Op.iLike]: `%${options.name}%`
        };
    }

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
ProviderService.transform = (params) => {
    const transformed = {};
    const fields = [
        'id',
        'name',
        'group',
        'secret',
        'status',
        'status_name',
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
ProviderService.getChangedProperties = ({ newModel, oldModel }) => {
    const changedProperties = [];
    const allChangableProperties = [
        'name',
        'group',
        'secret',
        'status',
        'status_name',
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
ProviderService.get = async (id) => {
    try {
        const data = await ProviderService.findOne({
            where: {
                id,
                is_active: true
            }
        });
        if (!data) {
            throw new APIError({
                status: httpStatus.NOT_FOUND,
                message: 'Không tìm thấy đối tác này'
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
ProviderService.list = async ({
    name,
    statuses,
    group,

    // page
    sort_by,
    order_by,
    skip = 0,
    limit = 20,
}) => {
    const options = filterConditions({
        name,
        statuses,
        group
    });
    const sort = sortConditions({ sort_by, order_by });
    return ProviderService.findAll({
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
ProviderService.totalRecords = ({
    name,
    statuses,
    group
}) => {
    const options = filterConditions({
        name,
        statuses,
        group
    });
    return ProviderService.count({ where: options });
};

/**
 * getSecret
 *
 * @public
 * @param {string} group
 */
ProviderService.getSecret = async (group) => {
    try {
        const data = await ProviderService.findOne({
            where: {
                is_active: true,
                group,
                status: ProviderService.Statuses.ACTIVE
            }
        });

        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Filter only allowed fields from Provider Service
 *
 * @param {Object} params
 */
ProviderService.filterParams = (params) => pick(params, PUBLIC_FIELDS);

/**
 * @typedef ProviderService
 */
export default ProviderService;

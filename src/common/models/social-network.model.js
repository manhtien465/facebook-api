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
class SocialNetwork extends Model { }
const { sequelize } = postgres;

const PUBLIC_FIELDS = [
    'name',
    'group',
    'secret',
    'thumbnail_url',
    'status',
    'status_name'
];

SocialNetwork.Statuses = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    // CHECK_PRODUCT: 'check_product'
};

SocialNetwork.NameStatuses = {
    ACTIVE: 'Đang hoạt động',
    INACTIVE: 'Ngừng hoạt động',
};


SocialNetwork.Groups = {
    TIKTOK: 'tiktok',
    INSTAGRAM: 'instagram',
    FACEBOOK: 'facebook',

};

/**
 * Provider Service Schema
 * @public
 */
SocialNetwork.init(
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
        thumbnail_url: {
            // name: 'Hình ảnh quảng cáo'
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        group: {
            type: DataTypes.STRING(50),
            values: values(SocialNetwork.Groups),
            allowNull: false
        },
        secret: {
            // gồm các app_id, token, secret ... tùy vào từng đối tác
            type: DataTypes.JSONB,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(50),
            values: values(SocialNetwork.Statuses),
            allowNull: false
        },
        status_name: {
            type: DataTypes.STRING(100),
            values: values(SocialNetwork.NameStatuses),
            allowNull: false
        },

        // manager
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        system_id: {
            type: DataTypes.STRING(50),
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
        modelName: 'social_networks',
        tableName: 'tbl_social_networks'
    }
);

/**
 * Register event emiter
 */
SocialNetwork.Events = {
    SOCIAL_NETWORK_CREATED: `${serviceName}.social-network.created`,
    SOCIAL_NETWORK_UPDATED: `${serviceName}.social-network.updated`,
    SOCIAL_NETWORK_DELETED: `${serviceName}.social-network.deleted`,
};
SocialNetwork.EVENT_SOURCE = `${serviceName}.social-media`;

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
SocialNetwork.addHook('afterCreate', (model) => {
    eventBus.emit(SocialNetwork.Events.SOCIAL_MEDIA_CREATED, model);
});

SocialNetwork.addHook('afterUpdate', (model) => {
    eventBus.emit(SocialNetwork.Events.SOCIAL_MEDIA_UPDATED, model);
});

SocialNetwork.addHook('afterDestroy', (model) => {
    eventBus.emit(SocialNetwork.Events.SOCIAL_MEDIA_DELETED, model);
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
    options.status = SocialNetwork.Statuses.ACTIVE;

    if (options.name) {
        options.name = {
            [Op.iLike]: `%${options.name}%`
        };
    }

    if (options.group) {
        options.group = options.group;
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
SocialNetwork.transform = (params) => {
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
SocialNetwork.getChangedProperties = ({ newModel, oldModel }) => {
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
SocialNetwork.get = async (id) => {
    try {
        const data = await SocialNetwork.findOne({
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
SocialNetwork.list = async ({
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
    return SocialNetwork.findAll({
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
SocialNetwork.totalRecords = ({
    name,
    statuses,
    group
}) => {
    const options = filterConditions({
        name,
        statuses,
        group
    });
    return SocialNetwork.count({ where: options });
};

// /**
//  * getSecret
//  *
//  * @public
//  * @param {string} group
//  */
// SocialNetwork.getSecret = async (group) => {
//     try {
//         const data = await SocialNetwork.findOne({
//             where: {
//                 is_active: true,
//                 group,
//                 status: SocialNetwork.Statuses.ACTIVE
//             }
//         });

//         return data;
//     } catch (error) {
//         throw error;
//     }
// };

/**
 * Filter only allowed fields from Provider Service
 *
 * @param {Object} params
 */
SocialNetwork.filterParams = (params) => pick(params, PUBLIC_FIELDS);

/**
 * @typedef SocialNetwork
 */
export default SocialNetwork;

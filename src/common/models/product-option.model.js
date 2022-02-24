/* eslint-disable no-param-reassign */
import { Model, DataTypes, Op } from 'sequelize';
import { pick, isEqual, isNil, omitBy, isUndefined, isNaN } from 'lodash';
import httpStatus from 'http-status';
import moment from 'moment-timezone';

import { serviceName } from '../../config/vars';
import eventBus from '../services/event-bus';
import postgres from '../../config/postgres';
import APIError from '../utils/APIError';
// import Stock from './stock.model';

/**
 * Create connection
 */
class ProductOption extends Model { }
const { sequelize } = postgres;

ProductOption.Types = {
    ITEM: 'item', // hàng hoá
    PART: 'part', // nguyên liệu thô
    COMBO: 'combo', // combo đóng gói
    SERVICE: 'service', // dịch vụ
    SHOPEE: 'shopee', // shopee
};

const PUBLIC_FIELDS = [
    'sku',
    'name',
    'unit',
    'barcode',
    'units',
    'images',
    'options',
    'indexes',
    'providers',
    'price_books',
    'parent_id',
    'master_id',
    'option_name',
    'original_price',
    'normal_price',
    'price',

    // filter
    'is_default',
    'name_path',
    'category_path',
    'attribute_path',
    'price_book_path',
    'normalize_name',
    'normalize_category',
    'normalize_attribute',
    'normalize_variation',
];

/**
 * Product Option Schema
 * @public
 */
ProductOption.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sku: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(10),
            defaultValue: 'item'
        },
        unit: {
            type: DataTypes.STRING(20),
            defaultValue: null
        },
        name: {
            type: DataTypes.STRING(155),
            allowNull: false
        },
        brand: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        units: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING(255)),
            defaultValue: []
        },
        barcode: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        options: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        indexes: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: []
        },
        price_books: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        providers: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'active'
        },
        status_name: {
            type: DataTypes.STRING(50),
            defaultValue: 'Đang hoạt động'
        },
        option_name: {
            type: DataTypes.STRING(155),
            defaultValue: 'Mặc định'
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        master_id: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        original_price: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        normal_price: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        discount: {
            type: DataTypes.JSONB,
            defaultValue: null
        },
        price: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },

        // filter
        name_path: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        category_path: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        attribute_path: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        price_book_path: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        normalize_name: {
            type: DataTypes.TEXT,
            defaultValue: null
        },
        normalize_category: {
            type: DataTypes.TEXT,
            defaultValue: null
        },
        normalize_attribute: {
            type: DataTypes.TEXT,
            defaultValue: null
        },
        normalize_variation: {
            type: DataTypes.TEXT,
            defaultValue: null
        },

        // metric
        view_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        order_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        return_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        rating_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        rating_average: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        favourite_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        // manager
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
        created_by: {
            type: DataTypes.JSONB,
            defaultValue: null
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_by: {
            type: DataTypes.JSONB,
            defaultValue: null
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        purchased_at: {
            type: DataTypes.DATE,
            defaultValue: null
        },
    },
    {
        timestamps: false,
        sequelize: sequelize,
        schema: 'product_service',
        modelName: 'product_option',
        tableName: 'tbl_product_options'
    }
);

/**
 * Add ForeignKey
 */
// ProductOption.hasMany(
//     Stock,
//     {
//         as: 'stocks',
//         sourceKey: 'id',
//         foreignKey: 'product_option_id',
//         constraints: false
//     }
// );

/**
 * Register event emiter
 */
ProductOption.Events = {
    PRODUCT_OPTION_CREATED: `${serviceName}.product-option.created`,
    PRODUCT_OPTION_UPDATED: `${serviceName}.product-option.updated`,
    PRODUCT_OPTION_DELETED: `${serviceName}.product-option.deleted`,
};
ProductOption.EVENT_SOURCE = `${serviceName}.product-option`;

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
ProductOption.addHook('afterCreate', async (data) => {
    // Step 1: update master id for item
    if (data.units && data.units.length) {
        const items = await ProductOption.list({
            parent_id: data.parent_id
        });
        if (items && items.length) {
            const masterUnit = data.units[0];
            const masterItem = items.find(
                i => (i.unit === masterUnit.name && i.option_name === data.option_name)
            );
            await data.update(
                {
                    master_id: masterItem.id
                }
            );
        }
    }
    return data;
});

ProductOption.addHook('afterCreate', (data) => {
    eventBus.emit(ProductOption.Events.PRODUCT_OPTION_CREATED, data);
});

ProductOption.addHook('afterUpdate', (data) => {
    eventBus.emit(ProductOption.Events.PRODUCT_OPTION_UPDATED, data);
});

ProductOption.addHook('afterDestroy', (data) => {
    eventBus.emit(ProductOption.Events.PRODUCT_OPTION_DELETED, data);
});

/**
 * Converter
 * @param {*} str
 */
function convertToEn(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.toLowerCase();
    return str;
}

/**
 * Load query
 * @param {*} params
 */
function filterConditions(params) {
    const options = omitBy(params, isNil);
    options.is_active = true;

    if (options.skus) {
        options.sku = { [Op.in]: options.skus.split(',') };
    }
    delete options.skus;

    if (options.types) {
        options.type = { [Op.in]: options.types.split(',') };
    }
    delete options.types;

    if (options.statuses) {
        options.status = { [Op.in]: options.statuses.split(',') };
    }
    delete options.statuses;

    if (options.attributes) {
        options.attribute_path = { [Op.contains]: options.attributes.split(',') };
    }
    delete options.attributes;

    if (options.categories) {
        options.category_path = { [Op.overlap]: options.categories.split(',') };
    }
    delete options.categories;

    if (options.price_books) {
        options.price_book_path = { [Op.overlap]: options.price_books.split(',') };
    }
    delete options.price_books;

    if (options.product_sku) {
        options.sku = { [Op.iLike]: `%${options.product_sku}%` };
    }
    delete options.product_sku;

    if (options.product_name) {
        const name = convertToEn(options.product_name);
        options.name_path = { [Op.contains]: name.split(' ') };
    }
    delete options.product_name;

    if (options.keyword) {
        const name = convertToEn(options.keyword);
        const data = name.split(' ');
        const operations = [];
        data.forEach(value => {
            operations.push({
                normalize_name: { [Op.iLike]: `%${value}%` }
            });
        });
        options[Op.and] = operations;
    }
    delete options.keyword;

    if (options.provider_type ||
        options.provider_option_id ||
        options.provider_shop_id
    ) {
        options.providers = {
            [Op.contains]: [
                {
                    type: options.provider_type,
                    provider_option_id: options.provider_option_id,
                    shop_id: options.provider_shop_id
                }
            ]
        };
    }
    delete options.provider_type;
    delete options.provider_option_id;
    delete options.provider_shop_id;

    if (options.child_id) {
        options.id = options.child_id;
    }
    delete options.child_id;

    if (options.system_id) {
        options.system_id = options.system_id;
    }

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
        case 'view_count':
            sort = ['view_count', order_by];
            break;
        case 'order_count':
            sort = ['order_count', order_by];
            break;
        case 'return_count':
            sort = ['return_count', order_by];
            break;
        case 'rating_count':
            sort = ['rating_count', order_by];
            break;
        case 'rating_average':
            sort = ['rating_average', order_by];
            break;
        case 'favourite_count':
            sort = ['favourite_count', order_by];
            break;
        case 'position':
            sort = ['position', order_by];
            break;
        case 'price':
            sort = ['price', order_by];
            break;
        case 'name':
            sort = ['name', order_by];
            break;
        case 'sku':
            sort = ['sku', order_by];
            break;
        default: sort = ['created_at', 'DESC'];
            break;
    }
    return sort;
}

/**
 * Transform postgres model to expose object
 */
ProductOption.transform = (params) => {
    const transformed = {};
    const fields = [
        'id',
        'sku',
        'unit',
        'type',
        'name',
        'brand',
        'barcode',
        'units',
        'images',
        'stocks',
        'options',
        'indexes',
        'providers',
        'parent_id',
        'is_default',
        'option_name',
        'price_books',
        'original_price',
        'normal_price',
        'discount',
        'price',
    ];
    fields.forEach((field) => {
        if (params[field] && field === 'stocks') {
            // transformed[field] = params[field].map(p => Stock.transform(p));
        } else {
            transformed[field] = params[field];
        }
    });

    // pipe decimal
    const decimalFields = [
        'original_price',
        'normal_price',
        'price'
    ];
    decimalFields.forEach((field) => {
        transformed[field] = parseInt(params[field], 0);
    });

    // pipe date
    const dateFields = [
        'purchased_at',
        'created_at',
        'updated_at'
    ];
    dateFields.forEach((field) => {
        transformed[field] = moment(params[field]).unix();
    });

    return transformed;
};

/**
 * Get all changed properties
 */
ProductOption.getChangedProperties = ({ newModel, oldModel }) => {
    const changedProperties = [];
    const allChangableProperties = [
        'sku',
        'name',
        'barcode',
        'option_name',
        'units',
        'unit',
        'images',
        'providers',
        'price_books',
        'original_price',
        'normal_price',
        'price',
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
 * Get
 *
 * @public
 * @param {String} optionId
 */
ProductOption.get = async (optionId) => {
    try {
        const option = await ProductOption.findOne({
            // include: [
            //     {
            //         model: Stock,
            //         as: 'stocks',
            //         required: false
            //     }
            // ],
            where: {
                [Op.or]: [
                    {
                        id: !isNaN(parseInt(optionId, 0)) && `${optionId}`.length < 10
                            ? parseInt(optionId, 0)
                            : null
                    },
                    {
                        sku: optionId.toString()
                    }
                ]
            }
        });
        if (isNil(option)) {
            throw new APIError({
                status: httpStatus.NOT_FOUND,
                message: `Không tìm thấy sản phẩm: ${optionId}`
            });
        }
        if (!option.is_active) {
            throw new APIError({
                status: httpStatus.NOT_FOUND,
                message: `Sản phẩm:${option.name}-${option.sku} đã được xoá khỏi hệ thống`
            });
        }
        return option;
    } catch (ex) {
        throw (ex);
    }
};

/**
 * List
 *
 * @param {number} skip - Number of records to be skipped.
 * @param {number} limit - Limit number of records to be returned.
 * @returns {Promise<Store[]>}
 */
ProductOption.list = async ({
    sku,
    keyword,
    child_id,
    parent_id,
    system_id,
    product_sku,
    product_name,
    price_books,
    attributes,
    categories,
    statuses,
    brands,
    types,
    skus,
    provider_option_id,
    provider_type,
    provider_shop_id,

    // sort condition
    skip = 0,
    limit = 50,
    sort_by = 'desc',
    order_by = 'created_at',
}) => {
    const options = filterConditions({
        sku,
        keyword,
        child_id,
        parent_id,
        system_id,
        product_sku,
        product_name,
        price_books,
        attributes,
        categories,
        statuses,
        brands,
        types,
        skus,
        provider_option_id,
        provider_type,
        provider_shop_id
    });
    const sorts = sortConditions({
        sort_by,
        order_by
    });
    return ProductOption.findAll({
        where: options,
        // include: [
        //     {
        //         model: Stock,
        //         as: 'stocks',
        //         required: false
        //     }
        // ],
        order: [sorts],
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
ProductOption.totalRecords = ({
    sku,
    keyword,
    child_id,
    parent_id,
    system_id,
    product_sku,
    product_name,
    price_books,
    attributes,
    categories,
    statuses,
    brands,
    types,
    skus,
    provider_option_id,
    provider_type,
    provider_shop_id,
}) => {
    const options = filterConditions({
        sku,
        keyword,
        child_id,
        parent_id,
        system_id,
        product_sku,
        product_name,
        price_books,
        attributes,
        categories,
        statuses,
        brands,
        types,
        skus,
        provider_option_id,
        provider_type,
        provider_shop_id,
    });
    return ProductOption.count({ where: options });
};

/**
 * Check Duplicate
 *
 * @public
 */
ProductOption.checkDuplicateSku = async ({ sku, id }) => {
    try {
        const operation = {
            sku: sku
        };
        if (id) {
            operation.id = {
                [Op.ne]: id
            };
        }
        const option = await ProductOption.findOne({
            where: operation
        });
        if (option) {
            throw new APIError({
                status: httpStatus.NOT_FOUND,
                message: `Mã hàng: ${sku} đã tồn tại trong hệ thống`
            });
        }
        return true;
    } catch (error) {
        throw (error);
    }
};

/**
 * Filter only allowed fields from product
 *
 * @param {Object} params
 */
ProductOption.filterParams = (params) => pick(params, PUBLIC_FIELDS);

/**
 * @typedef ProductOption
 */
export default ProductOption;

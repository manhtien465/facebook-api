/* eslint-disable no-param-reassign */
import { Model, DataTypes, Op, Sequelize } from 'sequelize';
import { pick, isEqual, values, isNil, omitBy, isNaN, includes } from 'lodash';
import moment from 'moment-timezone';
import httpStatus from 'http-status';

import { serviceName } from '../../config/vars';
import APIError from '../../common/utils/APIError';
import eventBus from '../services/event-bus';
import postgres from '../../config/postgres';

// import Stock from './stock.model';
// import StockHistory from './stock-history.model';
import ProductOption from './product-option.model';

/**
 * Create connection
 */
class Product extends Model { }
const { sequelize } = postgres;

Product.Types = {
    ITEM: 'item', // hàng hoá
    PART: 'part', // nguyên liệu thô
    COMBO: 'combo', // combo đóng gói
    SERVICE: 'service', // dịch vụ
    SHOPEE: 'shopee', // shopee
};

Product.Statuses = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

Product.NameStatuses = {
    ACTIVE: 'Đang hoạt động',
    INACTIVE: 'Ngừng hoạt động'
};

const PUBLIC_FIELDS = [
    'sku',
    'slug',
    'type',
    'name',
    'brand',
    'barcode',
    'hashtag',
    'document',
    'position',
    'description',
    'thumbnail_url',
    'background_url',
    'short_name',
    'video_url',

    // stock
    'unit',
    'weight',
    'stock_min',
    'stock_max',
    'stock_address',
    'original_price',
    'normal_price',
    'discount',
    'price',

    // extra
    'variations',
    'attributes',
    'categories',
    'products',
    'units',
    'parts',

    // seo
    'meta_url',
    'meta_title',
    'meta_image',
    'meta_keyword',
    'meta_description',

    // config
    'is_visible',
    'is_top_hot'
];

const EXCLUDE_FIELDS = [
    // stock
    'unit',
    'weight',
    'stock_min',
    'stock_max',
    'stock_address',
    'original_price',

    // attribute
    'document',
    'description',
    'variations',
    'attributes',
    'categories',
    'units',
    'parts',
];

const LIST_PUBLIC_FIELDS = [
    'id',
    'sku',
    'slug',
    'type',
    'name',
    'brand',
    'barcode',
    'hashtag',
    'position',
    'status',
    'status_name',
    'thumbnail_url',
    'short_name',
    'video_url',

    // stock
    'unit',
    'weight',
    'stock_min',
    'stock_max',
    'stock_address',
    'original_price',
    'normal_price',
    'discount',
    'price',

    // attribute
    'variations',
    'attributes',
    'categories',
    'units',
    'parts',

    // metric
    'view_count',
    'order_count',
    'return_count',
    'rating_count',
    'rating_average',
    'comment_count',
    'favourite_count',

    // config
    'is_active',
    'is_warning',
    'is_visible',
    'is_top_hot',
    'is_new_arrival',

    // manager
    'created_at',
    'created_by',
    'updated_at',
    'updated_by'
];

const BRAND_FIELDS = [
    'id',
    'name',
    'slug'
];

const UNIT_FIELDS = [
    'name',
    'quantity',
    'original_price'
];

const PART_FIELDS = [
    'id',
    'name',
    'price',
    'options',
    'option_id',
    'normal_price',
    'original_price',
    'thumbnail_url'
];

const PROVIDER_FIELDS = [
    'id',
    'name',
    'option_id',
    'provider_code'
];

const CATEGORY_FIELDS = [
    'id',
    'name',
    'slug'
];

const VARIATION_FIELDS = [
    'name',
    'values'
];

const ATTRIBUTE_FIELDS = [
    'id',
    'name',
    'value'
];

const DISCOUNT_FIELDS = [
    'id',
    'name',
    'rate',
    'value'
];

/**
 * Product Schema
 * @public
 */
Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sku: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        type: {
            type: DataTypes.STRING(10),
            values: values(Product.Types),
            defaultValue: Product.Types.ITEM
        },
        name: {
            type: DataTypes.STRING(155),
            allowNull: false
        },
        brand: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        barcode: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        hashtag: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        document: {
            type: DataTypes.TEXT,
            defaultValue: null
        },
        position: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        description: {
            type: DataTypes.TEXT,
            defaultValue: null
        },
        video_url: {
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        short_name: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        thumbnail_url: {
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        background_url: {
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        unit: {
            type: DataTypes.STRING(20),
            defaultValue: null
        },
        weight: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        stock_min: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        stock_max: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        stock_address: {
            type: DataTypes.STRING(255),
            defaultValue: ''
        },
        original_price: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        normal_price: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        campaign: {
            type: DataTypes.JSONB,
            defaultValue: null
        },
        discount: {
            type: DataTypes.JSONB,
            defaultValue: null
        },
        price: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },

        // extra
        status: {
            type: DataTypes.STRING(10),
            values: values(Product.Statuses),
            defaultValue: Product.Statuses.ACTIVE
        },
        status_name: {
            type: DataTypes.STRING(50),
            values: values(Product.NameStatuses),
            defaultValue: Product.NameStatuses.ACTIVE
        },
        suppliers: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        variations: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        attributes: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        categories: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        units: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        parts: {
            type: DataTypes.JSONB,
            defaultValue: []
        },

        // seo
        meta_url: {
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        meta_title: {
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        meta_image: {
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        meta_keyword: {
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        meta_description: {
            type: DataTypes.STRING(255),
            defaultValue: null
        },

        // filter
        name_path: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            defaultValue: []
        },
        supplier_path: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            defaultValue: []
        },
        category_path: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            defaultValue: []
        },
        attribute_path: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            defaultValue: []
        },
        variation_path: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
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
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        comment_count: {
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
        is_warning: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_top_hot: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_new_arrival: {
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
        purchased_at: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        created_by: {
            type: DataTypes.JSONB,
            defaultValue: null // id | name
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_by: {
            type: DataTypes.JSONB,
            defaultValue: null // id | name
        }
    },
    {
        timestamps: false,
        sequelize: sequelize,
        schema: 'product_service',
        modelName: 'product',
        tableName: 'tbl_products'
    }
);


/**
 * Add your
 * - foreignKey
 * - relations
 */
Product.hasMany(
    ProductOption,
    {
        as: 'products',
        sourceKey: 'id',
        foreignKey: 'parent_id',
        constraints: false
    }
);

// Product.hasMany(
//     Stock,
//     {
//         as: 'stocks',
//         sourceKey: 'id',
//         foreignKey: 'product_id',
//         constraints: false
//     }
// );

// Product.hasMany(
//     StockHistory,
//     {
//         as: 'histories',
//         sourceKey: 'id',
//         foreignKey: 'product_id',
//         constraints: false
//     }
// );

/**
 * Register event emiter
 */
Product.Events = {
    PRODUCT_CREATED: `${serviceName}.product.created`,
    PRODUCT_UPDATED: `${serviceName}.product.updated`,
    PRODUCT_DELETED: `${serviceName}.product.deleted`,
};
Product.EVENT_SOURCE = `${serviceName}.product`;

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
Product.addHook('afterCreate', (data, options) => {
    data.products = options.products;
    eventBus.emit(Product.Events.PRODUCT_CREATED, data);
});

Product.addHook('afterUpdate', (data) => {
    eventBus.emit(Product.Events.PRODUCT_UPDATED, data);
});

Product.addHook('afterDestroy', () => { });

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
        case 'total_quantity':
            sort = [Sequelize.literal('total_quantity'), order_by];
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

    if (options.suppliers) {
        options.supplier_path = { [Op.overlap]: options.suppliers.split(',') };
    }
    delete options.suppliers;

    if (options.variations) {
        options.variation_path = { [Op.overlap]: options.variations.split(',') };
    }
    delete options.variations;

    if (options.attributes) {
        options.attribute_path = { [Op.contains]: options.attributes.split(',') };
    }
    delete options.attributes;

    if (options.categories) {
        options.category_path = { [Op.overlap]: options.categories.split(',') };
    }
    delete options.categories;

    if (options.description) {
        options.description = { [Op.iLike]: `%${options.description}%` };
    }

    if (options.note) {
        options.note = { [Op.iLike]: `%${options.note}%` };
    }

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

    if (options.stock_value) {
        const literalQuery = `(
            SELECT SUM(stocks.total_quantity)
            FROM product_service.tbl_stocks AS stocks
            WHERE stocks.product_id = product.id and stocks.store_id ${options.stock_id ? `= ${options.stock_id}` : 'IS NOT NULL'}
        )`;

        if (options.stock_value === 1) {
            options[Op.and] = [
                Sequelize.literal(`${literalQuery} < product.stock_min`)
            ];
        }

        if (options.stock_value === 2) {
            options[Op.and] = [
                Sequelize.literal(`${literalQuery} > product.stock_max`)
            ];
        }

        if (options.stock_value === 3) {
            options[Op.and] = [
                Sequelize.literal(`${literalQuery} > 0`)
            ];
        }

        if (options.stock_value === 4) {
            options[Op.and] = [
                Sequelize.literal(`${literalQuery} <= 0`)
            ];
        }
    }
    delete options.stock_id;
    delete options.stock_value;

    if (options.discount_id) {
        options['discount.id'] = options.discount_id;
    }
    delete options.discount_id;

    if (options.is_has_discount) {
        options.discount = { [Op.ne]: null };
    }
    delete options.is_has_discount;

    // Min Max Filter
    checkMinMaxOfConditionFields(options, 'price', 'Number');
    checkMinMaxOfConditionFields(options, 'created_at', 'Date');

    return options;
}

/**
 * Transform postgres model to expose object
 */
Product.transform = (params, includeRestrictedFields = true) => {
    const transformed = {};
    const fields = [
        'id',
        'sku',
        'slug',
        'type',
        'name',
        'brand',
        'price',
        'weight',
        'barcode',
        'hashtag',
        'campaign',
        'discount',
        'position',
        'video_url',
        'short_name',
        'normal_price',
        'thumbnail_url',
        'background_url',
        'description',
        'document',

        // attribute
        'variations',
        'attributes',
        'categories',
        'products',
        'stocks',
        'parts',

        // seo
        'meta_url',
        'meta_title',
        'meta_image',
        'meta_keyword',
        'meta_description',

        // metric
        'view_count',
        'order_count',
        'return_count',
        'rating_count',
        'rating_average',
        'comment_count',
        'favourite_count',

        // config
        'is_visible',
        'is_top_hot',
        'is_new_arrival',

        // manager
        'purchased_at',
        'created_by',
        'created_at',
        'updated_at',
        'updated_by'
    ];
    if (includeRestrictedFields) {
        const privateFields = [
            // stock
            'unit',
            'stock_min',
            'stock_max',
            'stock_address',
            'original_price',
            'suppliers',
            'units',

            // info
            'status_name',
            'status'
        ];
        fields.push(...privateFields);
    }
    fields.forEach((field) => {
        if (params[field] && field === 'products') {
            transformed[field] = params[field].map(p => ProductOption.transform(p));
        } else if (params[field] && field === 'stocks') {
            // transformed[field] = params[field].map(p => Stock.transform(p));
        } else {
            transformed[field] = params[field];
        }
    });

    // pipe decimal
    const decimalFields = [
        'stock_min',
        'stock_max',
        'original_price',
        'normal_price',
        'price',
    ];
    decimalFields.forEach((field) => {
        if (params[field]) {
            transformed[field] = parseInt(params[field], 0);
        } else {
            transformed[field] = 0;
        }
    });

    // pipe date
    const dateFields = [
        'purchased_at',
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
Product.getChangedProperties = ({ newModel, oldModel }) => {
    const changedProperties = [];
    const allChangableProperties = [
        'sku',
        'slug',
        'type',
        'name',
        'brand',
        'barcode',
        'hashtag',
        'document',
        'position',
        'description',
        'video_url',
        'short_name',
        'thumbnail_url',
        'background_url',
        'original_price',
        'normal_price',
        'price',

        // seo
        'meta_url',
        'meta_title',
        'meta_image',
        'meta_keyword',
        'meta_description',

        // properties
        'variations',
        'attributes',
        'categories',
        'units',
        'parts',

        // config
        'is_visible',
        'is_top_hot',
        'is_new_arrival',

        // stock
        'unit',
        'weight',
        'stock_min',
        'stock_max',
        'stock_address',
    ];
    if (!oldModel) {
        return allChangableProperties;
    }

    allChangableProperties.forEach((field) => {
        if (!isEqual(newModel[field], oldModel[field])) {
            changedProperties.push(field);
        }
    });

    return changedProperties;
};

/**
 * Get
 *
 * @public
 * @param {String} productId
 */
Product.get = async (productId) => {
    try {
        const product = await Product.findOne({
            include: [
                {
                    model: ProductOption,
                    where: { is_active: true },
                    required: true,
                    as: 'products',
                    // include: [
                    //     {
                    //         model: Stock,
                    //         as: 'stocks',
                    //         required: false
                    //     }
                    // ],
                },
            ],
            where: {
                [Op.or]: [
                    {
                        id: !isNaN(+productId) && `${productId}`.length < 10
                            ? parseInt(productId, 0)
                            : null
                    },
                    {
                        sku: productId.toString()
                    },
                ]
            },
            order: [[
                {
                    model: ProductOption,
                    as: 'products'
                },
                'indexes',
                'ASC'
            ]],
        });
        if (isNil(product)) {
            throw new APIError({
                status: httpStatus.NOT_FOUND,
                message: `Không tìm thấy sản phẩm: ${productId}`
            });
        }
        if (!product.is_active) {
            throw new APIError({
                status: httpStatus.NOT_FOUND,
                message: `Sản phẩm:${product.name}-${product.sku} đã được xoá khỏi hệ thống`
            });
        }
        return product;
    } catch (error) {
        throw (error);
    }
};

/**
 * List
 *
 * @param {number} skip - Number of records to be skipped.
 * @param {number} limit - Limit number of records to be returned.
 * @returns {Promise<Store[]>}
 */
Product.list = async ({
    skus,
    types,
    fields,
    statuses,
    suppliers,
    variations,
    attributes,
    categories,
    system_id,
    is_include,
    is_visible,
    is_top_hot,
    is_new_arrival,
    is_has_discount,
    min_created_at,
    max_created_at,
    stock_value,
    stock_id,
    min_price,
    max_price,
    discount_id,
    description,
    keyword,
    note,

    // sort condition
    skip = 0,
    limit = 20,
    order_by = 'desc',
    sort_by = 'created_at',
}) => {
    const options = filterConditions({
        skus,
        types,
        statuses,
        suppliers,
        variations,
        attributes,
        categories,
        system_id,
        is_visible,
        is_top_hot,
        is_new_arrival,
        is_has_discount,
        min_created_at,
        max_created_at,
        stock_value,
        stock_id,
        min_price,
        max_price,
        discount_id,
        description,
        keyword,
        note,
    });
    const sorts = sortConditions({
        sort_by,
        order_by
    });
    return Product.findAll({
        where: options,
        attributes: {
            fields,
            include: [
                [
                    sequelize.literal(
                        `(
                            SELECT SUM(stocks.total_quantity)
                            FROM product_service.tbl_stocks AS stocks
                            WHERE stocks.product_id = product.id and stocks.store_id ${stock_id ? `= ${stock_id}` : 'IS NOT NULL'}
                        )`
                    ),
                    'total_quantity'
                ],
                [
                    sequelize.literal(
                        `(
                            SELECT SUM(stocks.total_order_quantity)
                            FROM product_service.tbl_stocks AS stocks
                            WHERE stocks.product_id = product.id and stocks.store_id ${stock_id ? `= ${stock_id}` : 'IS NOT NULL'}
                        )`
                    ),
                    'total_order_quantity'
                ]
            ]
        },
        order: [sorts],
        offset: skip,
        limit: limit
    }).then(products => {
        const operations = products.map(async item => {
            if (is_include) {
                item.products = await ProductOption.list({
                    parent_id: item.id
                });
                // item.stocks = await Stock.list({
                //     store_id: stock_id,
                //     product_id: item.id
                // });
            }
            return item;
        });
        return Promise.all(
            operations
        );
    });
};

/**
 * Total records.
 *
 * @param {number} skip - Number of records to be skipped.
 * @param {number} limit - Limit number of records to be returned.
 * @returns {Promise<Number>}
 */
Product.totalRecords = ({
    skus,
    types,
    statuses,
    suppliers,
    variations,
    attributes,
    categories,
    system_id,
    is_visible,
    is_top_hot,
    is_new_arrival,
    is_has_discount,
    min_created_at,
    max_created_at,
    stock_value,
    stock_id,
    min_price,
    max_price,
    discount_id,
    description,
    keyword,
    note,
}) => {
    const options = filterConditions({
        skus,
        types,
        statuses,
        suppliers,
        variations,
        attributes,
        categories,
        system_id,
        is_visible,
        is_top_hot,
        is_new_arrival,
        is_has_discount,
        min_created_at,
        max_created_at,
        stock_value,
        stock_id,
        min_price,
        max_price,
        discount_id,
        description,
        keyword,
        note,
    });
    return Product.count(
        { where: options }
    );
};

/**
 * Sum records.
 *
 * @param {number} skip - Number of records to be skipped.
 * @param {number} limit - Limit number of records to be returned.
 * @returns {Promise<Number>}
 */
Product.sumRecords = async ({
    skus,
    types,
    statuses,
    suppliers,
    variations,
    attributes,
    categories,
    system_id,
    is_visible,
    is_top_hot,
    is_new_arrival,
    is_has_discount,
    min_created_at,
    max_created_at,
    stock_value,
    stock_id,
    min_price,
    max_price,
    discount_id,
    description,
    keyword,
    note,
}) => {
    const options = filterConditions({
        skus,
        types,
        statuses,
        suppliers,
        variations,
        attributes,
        categories,
        system_id,
        is_visible,
        is_top_hot,
        is_new_arrival,
        is_has_discount,
        min_created_at,
        max_created_at,
        stock_value,
        stock_id,
        min_price,
        max_price,
        discount_id,
        description,
        keyword,
        note,
    });
    const records = await Product.findAll({
        attributes: ['id'],
        where: options,
    });
    const operations = {
        where: {
            product_id: {
                [Op.in]: records.map(i => i.id)
            }
        }
    };
    return {
        total_quantity: 0,
        total_order_quantity: 0
    };
};

/**
 * Check Duplicate
 *
 * @public
 */
Product.checkDuplicate = (error) => {
    const execption = error.errors[0];
    if (execption.type === 'unique violation') {
        return new APIError({
            message: 'Mã sản phẩm đã tồn tại!',
            errors: [
                {
                    field: 'sku',
                    location: 'body',
                    messages: ['"sku" already exists']
                }
            ],
            stack: execption.stack,
            status: httpStatus.CONFLICT
        });
    }
    return error;
};

/**
 * Filter only allowed fields from product
 *
 * @param {Object} params
 */
Product.filterParams = (params) => pick(params, PUBLIC_FIELDS);

/**
 * Include only allowed fields from product
 *
 * @param {Boolean} includeRestrictedFields
 */
Product.includeFields = (includeRestrictedFields = true) => {
    let params = LIST_PUBLIC_FIELDS;
    if (!includeRestrictedFields) {
        params = params.filter(
            field => !includes(EXCLUDE_FIELDS, field)
        );
    }
    return params;
};

/**
 * Filter only allowed fields from collum
 *
 * @param {String} collum
 * @param {Object} params
 */
Product.filterFieldParams = (collum, params) => {
    if (collum === 'VARIATION') {
        return pick(params, VARIATION_FIELDS);
    }
    if (collum === 'ATTRIBUTE') {
        return pick(params, ATTRIBUTE_FIELDS);
    }
    if (collum === 'CATEGORY') {
        return pick(params, CATEGORY_FIELDS);
    }
    if (collum === 'PROVIDER') {
        return pick(params, PROVIDER_FIELDS);
    }
    if (collum === 'DISCOUNT') {
        return pick(params, DISCOUNT_FIELDS);
    }
    if (collum === 'BRAND') {
        return pick(params, BRAND_FIELDS);
    }
    if (collum === 'UNIT') {
        return pick(params, UNIT_FIELDS);
    }
    if (collum === 'PART') {
        return pick(params, PART_FIELDS);
    }
    return null;
};

/**
 * @typedef Product
 */
export default Product;

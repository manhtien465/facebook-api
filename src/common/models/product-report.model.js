/* eslint-disable no-param-reassign */

import moment from 'moment-timezone';
import { Model } from 'sequelize';
import { isEqual, includes } from 'lodash';

import postgres from '../../config/postgres';


/**
 * Create connection
 */
class ProductReport extends Model { }
const { sequelize } = postgres;


/**
 * Get all changed properties
 *
 * @public
 * @param {Object} data newModel || oleModel
 */
ProductReport.getChangedProperties = ({ newModel, oldModel }) => {
    const changedProperties = [];
    const allChangableProperties = [
        'title',
        'slug',
        'avatar',
        'content',
        'products',
        'images',
        'cover',
        'background',
        'description',

        // social seo
        'meta_url',
        'meta_title',
        'meta_image',
        'meta_keyword',
        'meta_description',

        // manager
        'is_visible',
        'is_home_visible',
        'is_active',
        'updated_at',
    ];

    /** get all changable properties */
    allChangableProperties.forEach((field) => {
        if (includes(allChangableProperties, field)) {
            changedProperties.push(field);
        }
    });

    /** get data changed */
    const dataChanged = [];
    changedProperties.forEach((field) => {
        if (!isEqual(newModel[field], oldModel[field])) {
            dataChanged.push(field);
        }
    });
    return dataChanged;
};

/**
 * Transform excel excel postgres model to expose object
 */
ProductReport.transformExportExcel = (params) => {
    const transformed = {};
    const fields = [
        'parent_id',
        'parent_sku',
        'parent_name',
        'product_id',
        'product_sku',
        'product_name',
        'product_type',
        'product_status',
        'product_price',
        'product_original_price',
        'product_categories',
        'product_brand',
        'product_unit',
        'product_barcode',

        // excel field
        'order_store_id',
        'order_store_name',
        'code',
        'order_type',
        'order_id',
        'order_customer_name',
        'order_staff_name',
        'product_price',
        'order_product_price',
        'order_product_original_price',
        'order_total_value_15',
        'order_total_value_18',
        'total_discoutn_value',

        'store_id',
        'store_name',
        'staff_id',
        'staff_name',
        'customer_id',
        'customer_name',
        'supplier_id',
        'supplier_name'

    ];
    fields.forEach((field) => {
        transformed[field] = params[field];
    });


    // pipe date
    const dateFields = [
        'created_at_day',
    ];
    dateFields.forEach((field) => {
        if (params[field]) {
            transformed[field] = moment(params[field]).unix();
        } else {
            transformed[field] = null;
        }
    });

    const decimalFields = [
        'total_value_1',
        'total_value_2',
        'total_value_3',
        'total_value_4',
        'total_value_5',
        'total_value_6',
        'total_value_7',
        'total_value_8',
        'total_value_9',
        'total_value_10',
        'total_value_11',
        'total_value_12',
        'total_value_13',
        'total_value_14',
        'total_value_15',
        'total_value_16',
        'total_value_17',
        'total_value_18',
        'total_value_19',
        'total_value_20',
        'total_value_22',
        'total_value_26',
        'total_value_27',
        'total_value_28',
        'total_quantity_1',
        'total_quantity_2',
        'total_quantity_3',
        'total_quantity_4',
        'total_quantity_5',
        'total_quantity_6',
        'total_quantity_7',
        'total_quantity_8',
        'total_quantity_9',
        'total_quantity_10',
        'total_quantity_11',
        'total_quantity_12',
        'total_quantity_13',
        'total_quantity_14',
        'total_quantity_15',
        'total_quantity_20',
        'total_quantity_21',
        'total_quantity_22',
        'total_quantity_23',
        'total_quantity_24',
        'total_quantity_25',
        'total_quantity_27',
        'total_quantity_28',

        // excel field
        'total_quantity',
        'order_total_value_1',
        'order_total_quantity_1',
        'order_total_value_2',
        'order_total_quantity_2',
        'order_total_quantity_3',
        'order_total_value_14',
        'order_total_quantity_10',
        'order_total_quantity_14',
        'order_total_quantity_15',
        'order_total_value_15',
        'order_total_value_18',
        'order_total_quantity_6',
        'order_total_quantity_7',
        'order_total_value_5',
        'order_total_value_6',
        'order_total_value_25',
        'order_total_value_26',
        'total_discount_value',
        'customer_total_quantity_1',
        'customer_total_quantity_2',
        'customer_total_value_18',
        'customer_total_value_2',
        'customer_total_value_3',
        'staff_total_quantity_1',
        'staff_total_quantity_2',
        'staff_total_value_18',
        'staff_total_value_2',
        'staff_total_value_3',
    ];

    decimalFields.forEach((field) => {
        transformed[field] = parseInt(params[field], 0);
    });
    return transformed;
};

/**
 * Transform postgres model to expose object
 */
ProductReport.transform = (params) => {
    const transformed = {};
    const fields = [
        'parent_id',
        'parent_sku',
        'parent_name',
        'product_id',
        'product_sku',
        'product_name',
        'product_type',
        'product_status',
        'product_price',
        'product_original_price',
        'product_stock_min',
        'product_stock_max',
        'product_category_id',
        'product_category_name',
        'product_channel_id',
        'product_channel_name',
        'store_id',
        'store_name',
        'staff_id',
        'staff_name',
        'customer_id',
        'customer_name',
        'supplier_id',
        'supplier_name'
    ];
    fields.forEach((field) => {
        transformed[field] = params[field];
    });


    // pipe date
    const dateFields = [
        'created_at_day',
    ];
    dateFields.forEach((field) => {
        if (params[field]) {
            transformed[field] = moment(params[field]).unix();
        } else {
            transformed[field] = null;
        }
    });

    const decimalFields = [
        'total_value_1',
        'total_value_2',
        'total_value_3',
        'total_value_4',
        'total_value_5',
        'total_value_6',
        'total_value_7',
        'total_value_8',
        'total_value_9',
        'total_value_10',
        'total_value_11',
        'total_value_12',
        'total_value_13',
        'total_value_14',
        'total_value_15',
        'total_value_16',
        'total_value_17',
        'total_value_18',
        'total_value_19',
        'total_value_20',
        'total_value_22',
        'total_value_23',
        'total_value_24',
        'total_value_25',
        'total_value_26',
        'total_value_27',
        'total_value_28',
        'total_quantity_1',
        'total_quantity_2',
        'total_quantity_3',
        'total_quantity_4',
        'total_quantity_5',
        'total_quantity_6',
        'total_quantity_7',
        'total_quantity_8',
        'total_quantity_9',
        'total_quantity_10',
        'total_quantity_11',
        'total_quantity_12',
        'total_quantity_13',
        'total_quantity_14',
        'total_quantity_15',
        'total_quantity_20',
        'total_quantity_21',
        'total_quantity_22',
        'total_quantity_23',
        'total_quantity_25',
        'total_quantity_26',
        'total_quantity_27',
        'total_quantity_28',


    ];

    decimalFields.forEach((field) => {
        transformed[field] = parseInt(params[field], 0);
    });
    return transformed;
};


/**
* Get list product report
*
* @param {number} skip - Number of users to be skipped.
* @param {number} limit - Limit number of users to be returned.
* @returns {Promise<Number>}
*/
ProductReport.list = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    product_types,
    keyword,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM cocolux_report_service.get_product_report(
:min_created_at_day,
:max_created_at_day,
:stores,
:product_types,
:keyword
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            product_types: product_types ? `{${product_types}}` : null,
            keyword: keyword || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);


/**
* Get list product report by sale
*
* @param {params} params
* @returns {Promise<>}
*/
ProductReport.listBySale = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_sale(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Get list product report by sale specific
*
* @param {params} params
* @returns {Promise<>}
*/
ProductReport.listBySaleSpecific = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    product_id,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_sale_specific(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:productid
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            productid: product_id || null
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Get list product report by sale group by category
*
* @param {params} params
* @returns {Promise<>}
*/
ProductReport.listBySaleGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_sale_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Get list product report by profit
*
* @param {params} params
* @returns {Promise<>}
*/
ProductReport.listByProfit = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT *  FROM report_service.product_report_profit(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Get list product report by profit group category
*
* @param {params} params
* @returns {Promise<>}
*/
ProductReport.listByProfitGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT *  FROM report_service.product_report_profit_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Get list product report by stock value
*
* @param {params} params
* @returns {Promise<>}
*/
ProductReport.listByStockValue = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_stock_value(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            statuses: statuses ? `{${statuses}}` : null,
            keyword: keyword || null,
            category: category || null,
            stock: stock || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Get list product report by stock value group by category
*
* @param {params} params
* @returns {Promise<>}
*/
ProductReport.listByStockValueGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_stock_value_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            statuses: statuses ? `{${statuses}}` : null,
            keyword: keyword || null,
            category: category || null,
            stock: stock || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Get list product report by stock value with store
*
* @param {params} params
* @returns {Promise<>}
*/
ProductReport.listByStockValueStore = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_stock_value_store(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            statuses: statuses ? `{${statuses}}` : null,
            keyword: keyword || null,
            category: category || null,
            stock: stock || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Get list product report by stock detail
*
* @param {params} params
* @returns {Promise<>}
*/
ProductReport.listByStockDetail = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    product_id,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_stock_detail(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:productid,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            statuses: statuses ? `{${statuses}}` : null,
            keyword: keyword || null,
            category: category || null,
            stock: stock || null,
            productid: product_id || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Get list product report by stock detail store
*
* @param {params} params
* @returns {Promise<>}
*/
ProductReport.listByStockDetailStore = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    product_id,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_stock_detail_store(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:productid,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            statuses: statuses ? `{${statuses}}` : null,
            keyword: keyword || null,
            category: category || null,
            stock: stock || null,
            productid: product_id || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Get list product report by stock detail group category
*
* @param {params} params
* @returns {Promise<>}
*/
ProductReport.listByStockDetailGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    product_id,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_stock_detail_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:productid,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            statuses: statuses ? `{${statuses}}` : null,
            keyword: keyword || null,
            category: category || null,
            stock: stock || null,
            productid: product_id || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Get list product report by list stock detail
* @param {params} params
* @returns {Promise<>}
*/
ProductReport.listByStockDetail = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    product_id,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_stock_detail(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:productid,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            statuses: statuses ? `{${statuses}}` : null,
            keyword: keyword || null,
            category: category || null,
            stock: stock || null,
            productid: product_id || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* list by export
* @public
* @param {Parameters} params
*/
ProductReport.listByExport = ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    category,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_export(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:category,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            keyword: keyword || null,
            category: category || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* list by export group category
* @public
* @param {Parameters} params
*/
ProductReport.listByExportGroupCategory = ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    category,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_stock_detail_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:category,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            keyword: keyword || null,
            category: category || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* list by customer
* @public
* @param {Parameters} params
*/
ProductReport.listByCustomer = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    customer_keyword,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_customer(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:customer_keyword,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            customer_keyword: customer_keyword || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* list by customer specific
* @public
* @param {Parameters} params
*/
ProductReport.listByCustomerSpecific = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    customer_keyword,
    product_id,
    sort_by,
    order_by,
    skip = 0,
    limit = 50
}) => sequelize.query(
    `
SELECT * FROM  report_service.product_report_customer_specific(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:customer_keyword,
:productid,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            customer_keyword: customer_keyword || null,
            productid: product_id || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* list by customer group category
* @public
* @param {Parameters} params
*/
ProductReport.listByCustomerGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    customer_keyword,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_customer_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:customer_keyword,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            customer_keyword: customer_keyword || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
 * list by staff
* @public
* @param {Parameters} params
*/
ProductReport.listByStaff = ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    staffs,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_staff(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:staffs,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            staffs: staffs ? `{${staffs}}` : null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
 * list by staff specific
* @public
* @param {Parameters} params
*/
ProductReport.listByStaffSpecific = ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    staffs,
    product_id,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_staff_specific(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:staffs,
:productid,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            staffs: staffs ? `{${staffs}}` : null,
            productid: product_id || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* list by staff group category
* @public
* @param {Parameters} params
*/
ProductReport.listByStaffGroupCategory = ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    staffs,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_staff_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:staffs,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            staffs: staffs ? `{${staffs}}` : null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
 * list by supplier
 * @param {*} param0
 * @returns
 */
ProductReport.listBySupplier = ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    supplier_keyword,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT *  FROM report_service.product_report_supplier(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:supplier_keyword,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            supplier_keyword: supplier_keyword ? `{${supplier_keyword}}` : null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
 * list by supplier specific
 * @param {*} param
 * @returns
 */
ProductReport.listBySupplierSpecific = ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    supplier_keyword,
    product_id,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT *  FROM report_service.product_report_supplier_specific(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:supplier_keyword,
:productid,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            supplier_keyword: supplier_keyword ? `{${supplier_keyword}}` : null,
            productid: product_id || null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
 * list by supplier group category
 * @param {*} param
 * @returns
 */
ProductReport.listBySupplierGroupCategory = ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    supplier_keyword,
    sort_by,
    order_by,
    skip = 0,
    limit = 20
}) => sequelize.query(
    `
SELECT *  FROM report_service.product_report_supplier_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:supplier_keyword,
:sort_by,
:order_by
)
OFFSET ${skip}
LIMIT ${limit}
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            types: types ? `{${types}}` : null,
            keyword: keyword || null,
            category: category || null,
            supplier_keyword: supplier_keyword ? `{${supplier_keyword}}` : null,
            sort_by: sort_by || null,
            order_by: order_by || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Sum items list records
* @public
* @param {Parameters} params
*/
ProductReport.sumRecords = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    product_types,
    keyword
}) => sequelize.query(
    `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_value_1), 3) AS total_value_1,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_3), 3) AS total_value_3,
Round(SUM(total_value_4), 3) AS total_value_4,
Round(SUM(total_value_5), 3) AS total_value_5
FROM cocolux_report_service.get_product_report(
:min_created_at_day,
:max_created_at_day,
:stores,
:product_types,
:keyword
)
`,
    {
        replacements: {
            min_created_at_day: min_created_at_day || new Date(),
            max_created_at_day: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            product_types: product_types ? `{${product_types}}` : null,
            keyword: keyword || null,
        },
        type: sequelize.QueryTypes.SELECT
    }
);

/**
* Sum items list records by sale
* @public
* @param {Parameters} params
*/
ProductReport.sumBySale = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_3), 3) AS total_value_3,
Round(SUM(total_value_16), 3) AS total_value_16,
Round(SUM(total_value_18), 3) AS total_value_18,
Round(SUM(total_value_15), 3) AS total_value_15
FROM report_service.product_report_sale(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by sale specific
* @public
* @param {Parameters} params
*/
ProductReport.sumBySaleSpecific = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    product_id,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_value_16), 3) AS total_value_16,
Round(SUM(total_value_18), 3) AS total_value_18,
Round(SUM(total_value_15), 3) AS total_value_15
FROM report_service.product_report_sale_specific(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:productid
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                productid: product_id || null
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by sale group Category
*
* @public
* @param {Parameters} params
*/
ProductReport.sumBySaleGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_3), 3) AS total_value_3,
Round(SUM(total_value_16), 3) AS total_value_16,
Round(SUM(total_value_18), 3) AS total_value_18,
Round(SUM(total_value_15), 3) AS total_value_15
FROM report_service.product_report_sale_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by profit
* @public
* @param {Parameters} params
*/
ProductReport.sumByProfit = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_3), 3) AS total_value_3,
Round(SUM(total_value_4), 3) AS total_value_4,
Round(SUM(total_value_15), 3) AS total_value_15,
Round(SUM(total_value_16), 3) AS total_value_16,
Round(SUM(total_value_17), 3) AS total_value_17,
Round(SUM(total_value_18), 3) AS total_value_18,
Round(AVG(total_value_22),3) AS total_value_22
FROM report_service.product_report_profit(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                keyword: keyword || null,
                types: types ? `{${types}}` : null,
                category: category || null
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by profit group category
* @public
* @param {Parameters} params
*/
ProductReport.sumByProfitGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_3), 3) AS total_value_3,
Round(SUM(total_value_4), 3) AS total_value_4,
Round(SUM(total_value_15), 3) AS total_value_15,
Round(SUM(total_value_16), 3) AS total_value_16,
Round(SUM(total_value_17), 3) AS total_value_17,
Round(SUM(total_value_18), 3) AS total_value_18,
Round(AVG(total_value_22),3) AS total_value_22
FROM report_service.product_report_profit_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                keyword: keyword || null,
                types: types ? `{${types}}` : null,
                category: category || null
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by stock value
* @public
* @param {Parameters} params
*/
ProductReport.sumByStockValue = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_3), 3) as total_quantity_3,
Round(SUM(total_value_14), 3) as total_value_14,
Round(SUM(total_value_26), 3) as total_value_26 
FROM report_service.product_report_stock_value(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                statuses: statuses ? `{${statuses}}` : null,
                keyword: keyword || null,
                category: category || null,
                stock: stock || null,

            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};
/**
* Sum items list records by stock value store
* @public
* @param {Parameters} params
*/
ProductReport.sumByStockValueStore = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_3), 3) as total_quantity_3,
Round(SUM(total_value_14), 3) as total_value_14,
Round(SUM(total_value_26), 3) as total_value_26 
FROM report_service.product_report_stock_value_store(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                statuses: statuses ? `{${statuses}}` : null,
                keyword: keyword || null,
                category: category || null,
                stock: stock || null,

            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by stock value
* @public
* @param {Parameters} params
*/
ProductReport.sumByStockValueGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_3), 3) as total_quantity_3,
Round(SUM(total_value_14), 3) as total_value_14,
Round(SUM(total_value_26), 3) as total_value_26
FROM report_service.product_report_stock_value_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                statuses: statuses ? `{${statuses}}` : null,
                keyword: keyword || null,
                category: category || null,
                stock: stock || null,

            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by stock detail
* @public
* @param {Parameters} params
*/
ProductReport.sumByStockDetail = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    product_id,
}) => {
    const sum = await sequelize.query(
        `
      SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_quantity_5), 3) AS total_quantity_5,
Round(SUM(total_quantity_6), 3) AS total_quantity_6,
Round(SUM(total_quantity_7), 3) AS total_quantity_7,
Round(SUM(total_quantity_8), 3) AS total_quantity_8,
Round(SUM(total_quantity_9), 3) AS total_quantity_9,
Round(SUM(total_quantity_10), 3) AS total_quantity_10,
Round(SUM(total_quantity_12), 3) AS total_quantity_12,
Round(SUM(total_quantity_13), 3) AS total_quantity_13,
Round(SUM(total_quantity_14), 3) AS total_quantity_14,
Round(SUM(total_quantity_15), 3) AS total_quantity_15,
Round(SUM(total_value_1), 3) AS total_value_1,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_5), 3) AS total_value_5,
Round(SUM(total_value_6), 3) AS total_value_6,
Round(SUM(total_value_7), 3) AS total_value_7,
Round(SUM(total_value_8), 3) AS total_value_8,
Round(SUM(total_value_9), 3) AS total_value_9,
Round(SUM(total_value_10), 3) AS total_value_10,
Round(SUM(total_value_12), 3) AS total_value_12,
Round(SUM(total_value_13), 3) AS total_value_13,
Round(SUM(total_value_14), 3) AS total_value_14,
Round(SUM(total_value_15), 3) AS total_value_15

FROM report_service.product_report_stock_detail(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:productid
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                statuses: statuses ? `{${statuses}}` : null,
                keyword: keyword || null,
                category: category || null,
                stock: stock || null,
                productid: product_id || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records stock detail store
* @public
* @param {Parameters} params
*/
ProductReport.sumByStockDetailStore = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    product_id,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_quantity_5), 3) AS total_quantity_5,
Round(SUM(total_quantity_6), 3) AS total_quantity_6,
Round(SUM(total_quantity_7), 3) AS total_quantity_7,
Round(SUM(total_quantity_8), 3) AS total_quantity_8,
Round(SUM(total_quantity_9), 3) AS total_quantity_9,
Round(SUM(total_quantity_10), 3) AS total_quantity_10,
Round(SUM(total_quantity_12), 3) AS total_quantity_12,
Round(SUM(total_quantity_13), 3) AS total_quantity_13,
Round(SUM(total_quantity_14), 3) AS total_quantity_14,
Round(SUM(total_quantity_15), 3) AS total_quantity_15,
Round(SUM(total_value_1), 3) AS total_value_1,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_5), 3) AS total_value_5,
Round(SUM(total_value_6), 3) AS total_value_6,
Round(SUM(total_value_7), 3) AS total_value_7,
Round(SUM(total_value_8), 3) AS total_value_8,
Round(SUM(total_value_9), 3) AS total_value_9,
Round(SUM(total_value_10), 3) AS total_value_10,
Round(SUM(total_value_12), 3) AS total_value_12,
Round(SUM(total_value_13), 3) AS total_value_13,
Round(SUM(total_value_14), 3) AS total_value_14,
Round(SUM(total_value_15), 3) AS total_value_15

FROM report_service.product_report_stock_detail_store(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:productid
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                statuses: statuses ? `{${statuses}}` : null,
                keyword: keyword || null,
                category: category || null,
                stock: stock || null,
                productid: product_id || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};
/**
* Sum items list records by export and import
*
* @public
* @param {Parameters} params
*/
ProductReport.sumByStockDetailGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    product_id,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_quantity_5), 3) AS total_quantity_5,
Round(SUM(total_quantity_6), 3) AS total_quantity_6,
Round(SUM(total_quantity_7), 3) AS total_quantity_7,
Round(SUM(total_quantity_8), 3) AS total_quantity_8,
Round(SUM(total_quantity_9), 3) AS total_quantity_9,
Round(SUM(total_quantity_10), 3) AS total_quantity_10,
Round(SUM(total_quantity_12), 3) AS total_quantity_12,
Round(SUM(total_quantity_13), 3) AS total_quantity_13,
Round(SUM(total_quantity_14), 3) AS total_quantity_14,
Round(SUM(total_quantity_15), 3) AS total_quantity_15,
Round(SUM(total_value_1), 3) AS total_value_1,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_5), 3) AS total_value_5,
Round(SUM(total_value_6), 3) AS total_value_6,
Round(SUM(total_value_7), 3) AS total_value_7,
Round(SUM(total_value_8), 3) AS total_value_8,
Round(SUM(total_value_9), 3) AS total_value_9,
Round(SUM(total_value_10), 3) AS total_value_10,
Round(SUM(total_value_12), 3) AS total_value_12,
Round(SUM(total_value_13), 3) AS total_value_13,
Round(SUM(total_value_14), 3) AS total_value_14,
Round(SUM(total_value_15), 3) AS total_value_15

FROM report_service.product_report_stock_detail_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:productid
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                statuses: statuses ? `{${statuses}}` : null,
                keyword: keyword || null,
                category: category || null,
                stock: stock || null,
                productid: product_id || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by Export
*
* @public
* @param {Parameters} params
*/
ProductReport.sumByExport = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    category,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_10), 3) AS total_quantity_10,
Round(SUM(total_value_9), 3) AS total_value_9
FROM report_service.product_report_export(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:category
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                keyword: keyword || null,
                category: category || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by Export
*
* @public
* @param {Parameters} params
*/
ProductReport.sumByExportGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    category,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_10), 3) AS total_quantity_10,
Round(SUM(total_value_9), 3) AS total_value_9
FROM report_service.product_report_export_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:category
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                keyword: keyword || null,
                category: category || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};
/**
* Sum items list records by customer
*
* @public
* @param {Parameters} params
*/
ProductReport.sumByCustomer = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    customer_keyword,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_3), 3) AS total_value_3,
Round(SUM(total_value_15), 3) AS total_value_15,
Round(SUM(total_value_16), 3) AS total_value_16,
Round(SUM(total_value_18), 3) AS total_value_18
FROM report_service.product_report_customer(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:customer_keyword
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                customer_keyword: customer_keyword || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by customer specific
*
* @public
* @param {Parameters} params
*/
ProductReport.sumByCustomerSpecific = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    customer_keyword,
    product_id
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_3), 3) AS total_value_3,
Round(SUM(total_value_15), 3) AS total_value_15,
Round(SUM(total_value_16), 3) AS total_value_16,
Round(SUM(total_value_18), 3) AS total_value_18
FROM report_service.product_report_customer_specific(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:customer_keyword,
:productid
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                customer_keyword: customer_keyword || null,
                productid: product_id || null
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};
/**
* Sum items list records by customer group category
*
* @public
* @param {Parameters} params
*/
ProductReport.sumByCustomerGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    customer_keyword,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_3), 3) AS total_value_3,
Round(SUM(total_value_15), 3) AS total_value_15,
Round(SUM(total_value_16), 3) AS total_value_16,
Round(SUM(total_value_18), 3) AS total_value_18
FROM report_service.product_report_customer_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:customer_keyword
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                customer_keyword: customer_keyword || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};
/**
* Sum items list records by staff
*
* @public
* @param {Parameters} params
*/
ProductReport.sumByStaff = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    staffs,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_3), 3) AS total_value_3,
Round(SUM(total_value_15), 3) AS total_value_15,
Round(SUM(total_value_16), 3) AS total_value_16,
Round(SUM(total_value_18), 3) AS total_value_18
FROM report_service.product_report_staff(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:staffs
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                staffs: staffs ? `{${staffs}}` : null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};
/* Sum items list records by staff specific
*
* @public
* @param {Parameters} params
*/
ProductReport.sumByStaffSpecific = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    staffs,
    product_id
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_3), 3) AS total_value_3,
Round(SUM(total_value_15), 3) AS total_value_15,
Round(SUM(total_value_16), 3) AS total_value_16,
Round(SUM(total_value_18), 3) AS total_value_18
FROM report_service.product_report_staff_specific(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:staffs,
:productid
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                staffs: staffs ? `{${staffs}}` : null,
                productid: product_id || null
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by staff group category
*
* @public
* @param {Parameters} params
*/
ProductReport.sumByStaffGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    staffs,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_1), 3) AS total_quantity_1,
Round(SUM(total_quantity_2), 3) AS total_quantity_2,
Round(SUM(total_value_2), 3) AS total_value_2,
Round(SUM(total_value_3), 3) AS total_value_3,
Round(SUM(total_value_15), 3) AS total_value_15,
Round(SUM(total_value_16), 3) AS total_value_16,
Round(SUM(total_value_18), 3) AS total_value_18
FROM report_service.product_report_staff_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:staffs
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                staffs: staffs ? `{${staffs}}` : null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by supplier
*
* @public
* @param {Parameters} params
*/
ProductReport.sumBySupplier = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    supplier_keyword,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_6), 3) AS total_quantity_6,
Round(SUM(total_quantity_7), 3) AS total_quantity_7,
Round(SUM(total_value_5), 3) AS total_value_5,
Round(SUM(total_value_6), 3) AS total_value_6,
Round(SUM(total_value_25), 3) AS total_value_25
FROM report_service.product_report_supplier(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:supplier_keyword
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                supplier_keyword: supplier_keyword ? `{${supplier_keyword}}` : null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by supplier specific
*
* @public
* @param {Parameters} params
*/
ProductReport.sumBySupplierSpecific = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    supplier_keyword,
    product_id
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_6), 3) AS total_quantity_6,
Round(SUM(total_quantity_7), 3) AS total_quantity_7,
Round(SUM(total_value_5), 3) AS total_value_5,
Round(SUM(total_value_6), 3) AS total_value_6,
Round(SUM(total_value_25), 3) AS total_value_25
FROM report_service.product_report_supplier_specific(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:supplier_keyword,
:productid
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                supplier_keyword: supplier_keyword ? `{${supplier_keyword}}` : null,
                productid: product_id || null
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* Sum items list records by supplier group category
*
* @public
* @param {Parameters} params
*/
ProductReport.sumBySupplierGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    supplier_keyword,
}) => {
    const sum = await sequelize.query(
        `
SELECT
Round(SUM(total_quantity_6), 3) AS total_quantity_6,
Round(SUM(total_quantity_7), 3) AS total_quantity_7,
Round(SUM(total_value_5), 3) AS total_value_5,
Round(SUM(total_value_6), 3) AS total_value_6,
Round(SUM(total_value_25), 3) AS total_value_25
FROM report_service.product_report_supplier_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:supplier_keyword
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                supplier_keyword: supplier_keyword ? `{${supplier_keyword}}` : null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return sum[0];
};

/**
* count items list records by Cash Flow
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecords = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    product_types,
    keyword,
}) => {
    const sum = await sequelize.query(
        `
SELECT count(*) :: int FROM cocolux_report_service.get_product_report(
:min_created_at_day,
:max_created_at_day,
:stores,
:product_types,
:keyword
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                product_types: product_types ? `{${product_types}}` : null,
                keyword: keyword || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );

    return sum[0];
};

/**
* count items list records by Sale
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsBySale = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_sale(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }

    );
    return count[0].count;
};
/**
* count items list records by Sale
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsBySaleSpecific = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    product_id
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_sale_specific(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:productid
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                productid: product_id || null,

            },
            type: sequelize.QueryTypes.SELECT
        }

    );
    return count[0].count;
};

/**
* count items list records by sale group category
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsBySaleGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_sale_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }

    );
    return count[0].count;
};

/**
* count items list records by profit
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByProfit = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_profit(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by profit group category
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByProfitGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_profit_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by stock value
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByStockValue = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_stock_value(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                statuses: statuses ? `{${statuses}}` : null,
                keyword: keyword || null,
                category: category || null,
                stock: stock || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by stock value store
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByStockValueStore = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_stock_value_store(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                statuses: statuses ? `{${statuses}}` : null,
                keyword: keyword || null,
                category: category || null,
                stock: stock || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by Stock value group category
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByStockValueGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_stock_value_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                statuses: statuses ? `{${statuses}}` : null,
                keyword: keyword || null,
                category: category || null,
                stock: stock || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by stock detail
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByStockDetail = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    product_id,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_stock_detail(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:productid,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                statuses: statuses ? `{${statuses}}` : null,
                keyword: keyword || null,
                category: category || null,
                stock: stock || null,
                productid: product_id || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by stock detail store
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByStockDetailStore = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    product_id,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_stock_detail_store(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:productid,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                statuses: statuses ? `{${statuses}}` : null,
                keyword: keyword || null,
                category: category || null,
                stock: stock || null,
                productid: product_id || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by stock detail group category
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByStockDetailGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    statuses,
    category,
    stock,
    product_id,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_stock_detail_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:statuses,
:category,
:stock,
:productid,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                statuses: statuses ? `{${statuses}}` : null,
                keyword: keyword || null,
                category: category || null,
                stock: stock || null,
                productid: product_id || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by export
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByExport = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    category,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_export(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:category,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                keyword: keyword || null,
                category: category || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by export group category
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByExportGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    category,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_export_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:category,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                keyword: keyword || null,
                category: category || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by customer
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByCustomer = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    customer_keyword,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_customer(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:customer_keyword,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                customer_keyword: customer_keyword || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by customer specific
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByCustomerSpecific = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    customer_keyword,
    product_id,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_customer_specific(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:customer_keyword,
:productid,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                customer_keyword: customer_keyword || null,
                productid: product_id || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by customer group category
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByCustomerGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    customer_keyword,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_customer_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:customer_keyword,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                customer_keyword: customer_keyword || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by staff
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByStaff = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    staffs,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_staff(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:staffs,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                staffs: staffs ? `{${staffs}}` : null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by staff specific
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByStaffSpecific = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    staffs,
    product_id,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_staff_specific(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:staffs,
:productid,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                staffs: staffs ? `{${staffs}}` : null,
                productid: product_id || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};
/**
* count items list records by staff group category
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsByStaffGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    staffs,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_staff_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:staffs,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                staffs: staffs ? `{${staffs}}` : null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};
/**
* count items list records by supplier
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsBySupplier = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    supplier_keyword,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_supplier(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:supplier_keyword,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                supplier_keyword: supplier_keyword ? `{${supplier_keyword}}` : null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by supplier specific
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsBySupplierSpecific = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    supplier_keyword,
    product_id,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_supplier_specific(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:supplier_keyword,
:productid,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                supplier_keyword: supplier_keyword ? `{${supplier_keyword}}` : null,
                productid: product_id || null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
* count items list records by supplier group category
*
* @public
* @param {Parameters} params
*/
ProductReport.totalRecordsBySupplierGroupCategory = async ({
    min_created_at_day,
    max_created_at_day,
    stores,
    keyword,
    types,
    category,
    supplier_keyword,
    sort_by,
    order_by
}) => {
    const count = await sequelize.query(
        `
SELECT count(*) :: int FROM report_service.product_report_supplier_group_category(
:min_created_at_day,
:max_created_at_day,
:stores,
:keyword,
:types,
:category,
:supplier_keyword,
:sort_by,
:order_by
)
`,
        {
            replacements: {
                min_created_at_day: min_created_at_day || new Date(),
                max_created_at_day: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                types: types ? `{${types}}` : null,
                keyword: keyword || null,
                category: category || null,
                supplier_keyword: supplier_keyword ? `{${supplier_keyword}}` : null,
                sort_by: sort_by || null,
                order_by: order_by || null,
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
    return count[0].count;
};

/**
 * Export by sale
 * @param {*} params
 * @returns
 */
ProductReport.exportExcelBySale = async ({
    keyword,
    types,
    stores,
    category,
    min_created_at_day,
    max_created_at_day,
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_sale_export(
:min_created_at,
:max_created_at,
:stores,
:keyword,
:types,
:category
)
`,
    {
        replacements: {
            min_created_at: min_created_at_day || new Date(),
            max_created_at: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            keyword: keyword || null,
            types: types ? `{${types}}` : null,
            category: category || null
        },
        type: sequelize.QueryTypes.SELECT

    });

/**
 * Export by stock value
 * @param {*} params
 * @returns
 */
ProductReport.exportExcelByStockValue = async ({
    keyword,
    stores,
    category,
    stock,
    statuses,
    min_created_at_day,
    max_created_at_day,
}) => sequelize.query(
    `
select * from  report_service.product_report_stock_value_export(
:min_created_at,
:max_created_at,
:stores,
:keyword,
:statuses,
:category,
:stock
)
`,
    {
        replacements: {
            min_created_at: min_created_at_day || new Date(),
            max_created_at: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            keyword: keyword || null,
            statuses: statuses ? `{${statuses}}` : null,
            category: category || null,
            stock: stock || null
        },
        type: sequelize.QueryTypes.SELECT
    });

/**
 * Export by stock detail
 * @param {*} params
 * @returns
 */
ProductReport.exportExcelByStockValueGeneral = async ({
    keyword,
    stores,
    category,
    stock,
    statuses,
    min_created_at_day,
    max_created_at_day,
}) => sequelize.query(
    `
select * from  report_service.product_report_stock_value_export_general(
:min_created_at,
:max_created_at,
:stores,
:keyword,
:statuses,
:category,
:stock
)
`,
    {
        replacements: {
            min_created_at: min_created_at_day || new Date(),
            max_created_at: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            keyword: keyword || null,
            statuses: statuses ? `{${statuses}}` : null,
            category: category || null,
            stock: stock || null
        },
        type: sequelize.QueryTypes.SELECT
    });

/**
 * Export by stock detail
 * @param {*} params
 * @returns
 */
ProductReport.exportExcelByStockDetail = async ({
    keyword,
    stores,
    category,
    statuses,
    stock,
    min_created_at_day,
    max_created_at_day,
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_stock_detail_export(
:min_created_at,
:max_created_at,
:stores,
:keyword,
:statuses,
:category,
:stock
)
`,
    {
        replacements: {
            min_created_at: min_created_at_day || new Date(),
            max_created_at: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            statuses: statuses ? `{${statuses}}` : null,
            stock: stock || null,
            keyword: keyword || null,
            category: category || null,
        },
        type: sequelize.QueryTypes.SELECT

    });

/**
 * Export by stock detail general
 * @param {*} params
 * @returns
 */
ProductReport.exportExcelByStockDetailGeneral = async ({
    keyword,
    stores,
    category,
    statuses,
    stock,
    min_created_at_day,
    max_created_at_day,
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_stock_detail_export_general(
:min_created_at,
:max_created_at,
:stores,
:keyword,
:statuses,
:category,
:stock
)
`,
    {
        replacements: {
            min_created_at: min_created_at_day || new Date(),
            max_created_at: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            statuses: statuses ? `{${statuses}}` : null,
            stock: stock || null,
            keyword: keyword || null,
            category: category || null,
        },
        type: sequelize.QueryTypes.SELECT
    });

/**
 * Export by export
 * @param {*} params
 * @returns
 */
ProductReport.exportExcelByExport = async ({
    keyword,
    stores,
    category,
    min_created_at_day,
    max_created_at_day,
}) =>
    sequelize.query(
        `
SELECT * FROM report_service.product_report_export_export(
:min_created_at,
:max_created_at,
:stores,
:keyword,
:category
)
`,
        {
            replacements: {
                min_created_at: min_created_at_day || new Date(),
                max_created_at: max_created_at_day || new Date(),
                stores: stores ? `{${stores}}` : null,
                keyword: keyword || null,
                category: category || null,
            },
            type: sequelize.QueryTypes.SELECT

        });

/**
 * Export by staff
 * @param {*} params
 * @returns
 */
ProductReport.exportExcelByStaff = async ({
    keyword,
    staffs,
    types,
    stores,
    category,
    min_created_at_day,
    max_created_at_day,
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_staff_export(
:min_created_at,
:max_created_at,
:stores,
:keyword,
:types,
:category,
:staffs
)
`,
    {
        replacements: {
            min_created_at: min_created_at_day || new Date(),
            max_created_at: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            keyword: keyword || null,
            types: types ? `{${types}}` : null,
            category: category || null,
            staffs: staffs ? `{${staffs}}` : null,
        },
        type: sequelize.QueryTypes.SELECT

    });

/**
 * Export by customer
 * @param {*} params
 * @returns
 */
ProductReport.exportExcelByCustomer = async ({
    keyword,
    customer_keyword,
    types,
    stores,
    category,
    min_created_at_day,
    max_created_at_day,
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_customer_export(
:min_created_at,
:max_created_at,
:stores,
:keyword,
:types,
:category,
:customer_keyword
)
`,
    {
        replacements: {
            min_created_at: min_created_at_day || new Date(),
            max_created_at: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            keyword: keyword || null,
            types: types ? `{${types}}` : null,
            category: category || null,
            customer_keyword: customer_keyword || null
        },
        type: sequelize.QueryTypes.SELECT

    });

/**
 * Export by supplier
 * @param {*} params
 * @returns
 */
ProductReport.exportExcelBySupplier = async ({
    keyword,
    supplier_keyword,
    types,
    stores,
    category,
    min_created_at_day,
    max_created_at_day,
}) => sequelize.query(
    `
SELECT * FROM report_service.product_report_supplier_export(
:min_created_at,
:max_created_at,
:stores,
:keyword,
:types,
:category,
:supplier_keyword
)
`,
    {
        replacements: {
            min_created_at: min_created_at_day || new Date(),
            max_created_at: max_created_at_day || new Date(),
            stores: stores ? `{${stores}}` : null,
            keyword: keyword || null,
            types: types ? `{${types}}` : null,
            category: category || null,
            supplier_keyword: supplier_keyword || null
        },
        type: sequelize.QueryTypes.SELECT

    });


export default ProductReport;

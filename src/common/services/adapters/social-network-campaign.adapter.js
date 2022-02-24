import { Op } from 'sequelize';
import { isNil } from 'lodash';
import httpStatus from 'http-status';
import APIError from '../../utils/APIError';
import Product from '../../models/product.model';
import ProductOption from '../../models/product-option.model';
import SocialNetworkCampaign from '../../models/social-network-campaign.model';

async function getOption(item) {
    const returnOption = {
        id: item.id,
        option_id: item.option_id,
        master_id: item.master_id,
        sku: null,
        option_name: null,
        original_price: 0,
        normal_price: 0,
        price: 0,
        keyword: item.keyword,
    };
    if (item.option_id) {
        const product = await ProductOption.get(
            item.option_id
        );
        returnOption.option_id = product.id;
        returnOption.master_id = product.master_id;
        returnOption.sku = product.sku;
        returnOption.option_name = product.option_name;
        returnOption.original_price = Math.ceil(product.original_price);
        returnOption.normal_price = Math.ceil(product.price);
        returnOption.price = Math.ceil(product.price - returnOption.discount_value);
        returnOption.keyword = `${product.sku}`;
    }
    return returnOption;
}

async function getItem(item) {
    const returnOption = {
        id: null,
        option_id: null,
        name: null,
        normal_price: 0,
        price: 0,
        keyword: item.keyword,
    };
    if (item.id) {
        const product = await Product.get(
            item.id
        );
        returnOption.id = product.id;
        returnOption.sku = product.sku;
        returnOption.name = product.name;
        returnOption.normal_price = Math.ceil(product.normal_price);
        returnOption.price = Math.ceil(product.price);
        returnOption.keyword = `${product.sku}`;
    }
    return returnOption;
}

/**
 * Parse item to import item
 * @param {*} options
 */
async function parseOptions(options) {
    const promises = options.map(getOption);
    return Promise.all(promises);
}

/**
 * Parse item to import item
 * @param {*} items
 */
async function parseItems(items) {
    const promises = items.map(getItem);
    return Promise.all(promises);
}
/**
 * Check campaign valid
 */
async function getCampaignFromItem({ master_id, option_id }) {
    const data = await SocialNetworkCampaign.findOne({
        where: {
            status: SocialNetworkCampaign.Statuses.STARTING,
            applied_items: { [Op.contains]: [{ id: master_id }] },
            applied_options: { [Op.contains]: [{ option_id: option_id }] },
        }
    });
    if (isNil(data)) {
        throw new APIError({
            status: httpStatus.NOT_FOUND,
            message: 'Chương trình khuyến mại này không còn tồn tại hoặc đã kết thúc'
        });
    }
    const item = data.applied_options.find(
        i => i.option_id === option_id
    );
    return {
        id: data.id,
        name: data.name,
        product_id: item.id,
        option_id: item.option_id,
        master_id: master_id,
        min_quantity: item.min_quantity,
        max_quantity: item.max_quantity,
        discount_rate: item.discount_rate,
        discount_value: item.discount_value,
    };
}

export default {
    parseItems,
    parseOptions,
    getCampaignFromItem
};

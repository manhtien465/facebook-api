import Joi from 'joi';

module.exports = {
    // GET v1/stock-histories
    listSocialNetworkCampaign: {
        query: {
            skip: Joi.number()
                .min(0)
                .allow(null, ''),
            limit: Joi.number()
                .min(1)
                .max(10000)
                .allow(null, ''),
            product_id: Joi.number()
                .allow(null, ''),
            product_option_id: Joi.number()
                .allow(null, '')
        }
    }
};

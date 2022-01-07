import Joi from 'joi';

module.exports = {
    // GET /v1/product-reports
    confirm: {
        query: {
            // pagging
            hub_mode: Joi.string(),
            hub_challenge: Joi.number(),
            hub_verify_token: Joi.number(),
        }
    },
};

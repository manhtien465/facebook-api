
import Provider from '../../common/models/social-network.model';
import facebookAdapter from '../../common/services/adapters/facebook.adapter';
import { handler as ErrorHandler } from './error';
// import { port } from '../../../config/vars';
exports.load = async (req, res, next) => {
    const { name } = req.body;
    const provider = await Provider.find({ name });
    req.locals = req.locals ? req.locals : {};
    req.locals.provider = provider;
    next();
};
exports.loadPost = async (req, res, next) => {
    const { provider } = req.locals;
    const posts = await facebookAdapter.getPost({
        access_token: provider.access_token,
        limit: req.query.limit,
        skip: req.query.skip
    });
    req.locals = req.locals ? req.locals : {};
    req.locals.posts = posts;
    next();
};
exports.prepareConnect = async (req, res, next) => {
    try {
        const { access_token: user_access_token } = await facebookAdapter.getUserAccessToken(req.query);
        const { id: user_id } = await facebookAdapter.getUser({
            fields: req.query.fields,
            access_token: user_access_token
        });
        const data = {
            user_access_token,
            user_id
        };
        req.locals = req.locals ? req.locals : {};
        req.locals.data = data;
        return next();
    } catch (ex) {
        return ErrorHandler(ex, req, res, next);
    }
};
exports.prepareWebhook = async (req, res, next) => {
    try {
        const body = req.body;
        console.log(req.body);
        console.log('đã có webhook');
        const operation = [];
        let operationProduct = [];
        // Checks this is an event from a page subscription
        if (body.object === 'page') {
            // Iterates over each entry - there may be multiple if batched
            body.entry.forEach((entry) => {
                if (entry.changes && entry.changes.length > 0) {
                    entry.changes.map((v) => {
                        console.log(v);
                        return null;
                    });
                }
                if (entry.messaging && entry.messaging.length > 0) {
                    entry.messaging.map((v) => {
                        console.log(v);
                        return null;
                    });
                }
            });
        }
        if (body.object === 'user') {
            console.log('run in usser');
            // Iterates over each entry - there may be multiple if batched
            body.entry.forEach((entry) => {
                console.log(entry);
                if (entry.changed_fields && entry.changed_fields.length > 0) {
                    entry.changed_fields.map((v) => {
                        console.log('ben trong', v);
                        return null;
                    });
                }
            });
        }
        if (body.object === 'feed') {
            // Iterates over each entry - there may be multiple if batched
            body.entry.forEach((entry) => {
                operation.push(entry);
            });
        }
        const listCampaign = await facebookAdapter.parseWebhook(operation);
        listCampaign.forEach((campaign, i) => {
            const product = campaign.applied_items.find((el) => el.keyword === operation[i].message);
            if (product) {
                operation[i].social_network_id = campaign.social_network_id;
                operation[i].product = product;
                operation[i].content = campaign.message;
                operationProduct.push(operation[i]);
            }
        });
        operationProduct = await facebookAdapter.parseSocialNetWork(operationProduct);
        await facebookAdapter.parseSendMessage(operationProduct);
        return next();
    } catch (ex) {
        return ErrorHandler(ex, req, res, next);
    }
};


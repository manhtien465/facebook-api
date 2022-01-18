
import Provider from '../../common/models/provider-service.model';
import facebookAdapter from '../../common/services/adapters/facebook.adapter';

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
        ...req.query
    });
    req.locals = req.locals ? req.locals : {};
    req.locals.posts = posts;
    next();
};

// exports.prepareParamAddPost = async (req, res, next) => {
// const { provider } = req.locals;
// check=
//     next();
// };


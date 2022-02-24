import LazadaAPI from 'lazada-open-platform-sdk';
import { handler as ErrorHandler } from '../../middlewares/error';
// import lazadaAdapter from '../../../common/services/adapters/lazada.adapter';

const aLazadaAPI = new LazadaAPI('107204', 'EIoQaW8VCYJmWhWybP33NQq65uEHupR1', 'VIETNAM');
exports.gen = async (req, res, next) => {
    try {
        let access_token = null;
        // await lazadaAdapter.generateAccessToken();
        aLazadaAPI
            .generateAccessToken({ code: req.body.auth_code })
            .then(response => {
                console.log('reponse', response);
                access_token = response.access_token;
            });
        return res.json({ access_token });
    } catch (ex) {
        return ErrorHandler(ex, req, res, next);
    }
};

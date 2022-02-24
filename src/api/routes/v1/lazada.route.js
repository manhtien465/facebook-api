import express from 'express';

// import { authorize } from 'auth-adapter';
// import Permissions from '../../../common/utils/Permissions';
import controller from '../../controllers/v1/lazada.controller';


const router = express.Router();

router
    .route('/gen-token')
    .post(

        controller.gen
    );
export default router;

import express from 'express';
import validate from 'express-validation';
// import { authorize } from 'auth-adapter';
// import Permissions from '../../../common/utils/Permissions';
import controller from '../../controllers/v1/facebook.controller';
// import middleware from '../../middlewares/facebook.middleware';

import { confirm } from '../../validations/facebook.validation';

const router = express.Router();

router
    .route('/')
    .get(
        validate(confirm),
        controller.confirm
    );
export default router;

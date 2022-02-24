import express from 'express';
import validate from 'express-validation';
import { authorize } from 'auth-adapter';
import Permissions from '../../../common/utils/Permissions';
import controller from '../../controllers/v1/social-network.controller';
import middleware from '../../middlewares/social-network.middleware';

import {
    listValidation,
    createValidation,
    updateValidation
} from '../../validations/social-network.validation';

const router = express.Router();

router
    .route('/')
    .get(
        validate(listValidation),
        authorize([Permissions.BANNER_CREATE]),
        middleware.filterQuery,
        middleware.count,
        controller.list
    )
    .post(
        validate(createValidation),
        authorize([Permissions.BANNER_CREATE]),
        middleware.loadUser,
        middleware.prepareParams,
        controller.create
    );

router
    .route('/:id')
    .get(
        middleware.load,
        controller.detail
    )
    .put(
        validate(updateValidation),
        authorize([Permissions.BANNER_UPDATE]),
        middleware.load,
        middleware.prepareUpdate,
        controller.update
    )
    .delete(
        authorize([Permissions.BANNER_DELETE]),
        middleware.load,
        controller.delete
    );

router
    .route('/:id/posts')
    .get(
        // validate(listValidation),
        authorize([Permissions.BANNER_CREATE]),
        middleware.load,
        // middleware.countPost,
        middleware.loadPost,
        controller.listPost
    );
router
    .route('/:id/pages')
    .get(
        // validate(listValidation),
        authorize([Permissions.BANNER_CREATE]),
        middleware.load,
        middleware.loadPage,
        controller.listPage,
    );
router
    .route('/:id/page-access-token')
    .post(
        // validate(listValidation),
        authorize([Permissions.BANNER_CREATE]),
        middleware.load,
        middleware.loadPageAccessToken,
        controller.getPageAccessToken,
    );
export default router;


import express from 'express';
import validate from 'express-validation';
import { authorize } from 'auth-adapter';
import Permissions from '../../../common/utils/Permissions';
import controller from '../../controllers/v1/social-network-campaign.controller';
import middleware from '../../middlewares/social-network-campaign.middleware';

import {
    listValidation,
    createValidation,
    updateValidation
} from '../../validations/social-network-campaign.validation';

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
        middleware.prepareReplace,
        middleware.checkTimeUpdate,
        middleware.prepareUpdate,
        controller.update
    )
    .delete(
        authorize([Permissions.BANNER_DELETE]),
        middleware.load,
        controller.delete
    );

router
    .route('/:id/block')
    .post(
        authorize([Permissions.CAMPAIGN_UPDATE]),
        middleware.load,
        controller.block
    );

router
    .route('/:id/active')
    .post(
        authorize([Permissions.CAMPAIGN_UPDATE]),
        middleware.load,
        controller.active
    );

router
    .route('/:id/finish')
    .post(
        authorize([Permissions.CAMPAIGN_UPDATE]),
        middleware.load,
        controller.finish
    );

router
    .route('/:id/cancel')
    .post(
        authorize([Permissions.CAMPAIGN_UPDATE]),
        middleware.load,
        controller.cancel
    );

export default router;


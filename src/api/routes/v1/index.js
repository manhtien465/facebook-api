import express from 'express';
import facebook from './facebook.route';
import SocialNetwork from './social-network.route';
import SocialNetworkCampaign from './social-network-campaign.route';
import lazadaRoute from './lazada.route';

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.get('/version/:service', (req, res) => res.send(process.env.GIT_COMMIT_TAG || 'Not available'));

router.use('/webhook', facebook);
router.use('/social-network', SocialNetwork);
router.use('/social-network-campaign', SocialNetworkCampaign);
router.use('/lazada', lazadaRoute);
export default router;

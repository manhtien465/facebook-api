import express from 'express';
import facebook from './facebook.route';

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.get('/version/:service', (req, res) => res.send(process.env.GIT_COMMIT_TAG || 'Not available'));

router.use('/webhook', facebook);

export default router;

const {Router} = require('express');
const router = Router();

router.use('/auth',require('./auth/auth.router'));
router.use('/storage',require('./storage/storage.router'));
router.use('/provider',require('./provider/provider.router'));
router.use('/live-services',require('./live_services/live.services.router'));

module.exports = router;
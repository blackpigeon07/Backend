const {Router} = require('express');
const router = Router();

router.use('/auth',require('./auth/auth.router'));
router.use('/storage',require('./storage/storage.router'));

module.exports = router;
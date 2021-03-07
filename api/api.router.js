const {Router} = require('express');
const router = Router();

router.use('/auth',require('./auth/auth.router'));

module.exports = router;
const {Router} = require('express');
const router = Router();
const {verify}= require('./auth.controller');


router.use('/phone',require('./services/phone/phone.router'));
router.post('/verify',verify);


module.exports = router;
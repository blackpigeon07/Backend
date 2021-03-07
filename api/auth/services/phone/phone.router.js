const {Router} = require('express');
const router = Router();
const {sendOTP,verifyOTP}= require('./phone.controller');

router.post('/sendotp',sendOTP);
router.post('/verifyotp',verifyOTP)


module.exports = router;
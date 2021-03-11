const express = require('express');
const router = express.Router();
const {create,read,update,remove} = require('./live.services.controller');

router.post('/create',create);
router.post('/read',read);
router.put('/update',update);
router.delete('/delete',remove);

module.exports = router;
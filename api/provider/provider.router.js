const {Router} = require('express');
const router = Router();
const {createProvider,getProvider,updateProvider,deleteProvider} = require('./provider.controller');

router.post('/newprovider',createProvider);
router.post('/getprovider',getProvider);
router.post('/updateprovider',updateProvider);
router.delete('/deleteprovider',deleteProvider);

module.exports = router;
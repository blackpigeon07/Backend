const {Router} = require('express');
const router = Router();
const {uploadFile,downloadFile} = require('./storage.controller');
const uploads = require('./storage.middleware');

router.post('/uploadfile',uploads, uploadFile);
router.get('/downloadfile',downloadFile);

module.exports = router;
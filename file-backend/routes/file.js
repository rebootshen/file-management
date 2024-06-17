// routes/file.js
const express = require('express');
const router = express.Router();
const { uploadFile, getFiles, updateFile, deleteFile, downloadFile, getSignedUrl } = require('../controllers/fileController');
const { auth, authorize } = require('../middle/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', auth, authorize('admin', 'editor'), upload.single('file'), uploadFile);
router.get('/', auth, getFiles);
router.put('/:id', auth, authorize('admin', 'editor'), updateFile);
router.delete('/:id', auth, authorize('admin', 'editor'), deleteFile);
router.get('/download/:id', auth, downloadFile);
router.get('/signed-url/:id', auth, getSignedUrl);

module.exports = router;
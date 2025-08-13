const express = require('express');
const router = express.Router();
const { createDocument, getDocumentById, exportDocumentToPdf } = require('../controllers/documentController');

router.route('/').post(createDocument);
router.route('/:id').get(getDocumentById);
router.route('/export/pdf').post(exportDocumentToPdf);

module.exports = router;

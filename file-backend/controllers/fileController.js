// controllers/fileController.js
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const File = require('../models/File'); // Import the File model


const uploadFile = (req, res) => {
  res.json({ message: 'File uploaded successfully', file: req.file });
};

const getFiles = (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to retrieve files' });
    }
    res.json(files);
  });
};

const updateFile = (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  fs.rename(path.join('uploads', id), path.join('uploads', newName), (err) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to rename file' });
    }
    res.json({ message: 'File renamed successfully' });
  });
};

const deleteFile = (req, res) => {
  const { id } = req.params;

  fs.unlink(path.join('uploads', id), (err) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to delete file' });
    }
    res.json({ message: 'File deleted successfully' });
  });
};

const downloadFile = (req, res) => {
    const { id } = req.params;
    const filePath = path.join('uploads', id);
    res.download(filePath);
};

const getSignedUrl = (req, res) => {
  const { id } = req.params;
  //const token = jwt.sign({ fileId: id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const signedUrl = `${req.protocol}://${req.get('host')}/api/files/download/${id}`;
  console.log(signedUrl)
  res.json({ url: signedUrl });
};

module.exports = { uploadFile, getFiles, updateFile, deleteFile, downloadFile, getSignedUrl };
// controllers/fileController.js
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const File = require('../models/File'); // Import the File model
const { param, body, validationResult } = require('express-validator');

// Helper function to validate filenames
const isValidFilename = (filename) => /^[a-zA-Z0-9-_]+\.(jpg|jpeg|png|pdf|txt|doc|docx)$/i.test(filename);
const isValidName = (name) => /^[\.]?[a-zA-Z0-9-_]+$/i.test(name);


const uploadFile = (req, res) => {
  const { filename, originalname } = req.file;

  if (!isValidFilename(originalname)) {
    return res.status(400).json({ message: 'Invalid original file name' });
  }

  if (!isValidName(filename)) {
    return res.status(400).json({ message: 'Invalid file name '+filename });
  }

  fs.rename(path.join('uploads', filename), path.join('uploads', originalname), (err) => {
    if (err) {
      console.log('Unable to rename file to original name:', err);
      return res.status(500).json({ message: 'Unable to rename file to oiginal name' });
    }
    console.log('File renamed successfully');
    res.json({ message: 'File uploaded successfully', file: originalname });
  });
};

const getFiles = (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to retrieve files' });
    }
    res.json(files);
  });
};

const updateFile = [
  param('id').trim().escape(),
  body('newName').trim().escape(),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { newName } = req.body;

    if (!isValidFilename(newName)) {
      return res.status(400).json({ message: 'Invalid new file name' });
    }

    if (!(isValidName(id)||isValidFilename(id))) {
      return res.status(400).json({ message: 'Invalid file name '+id });
    }

    fs.rename(path.join('uploads', id), path.join('uploads', newName), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Unable to rename file '+id+' to '+newName });
      }
      res.json({ message: 'File renamed successfully' });
    });
  }
];

const deleteFile = [
  param('id').trim().escape(),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    if (!(isValidFilename(id)||isValidName(id))) {
      return res.status(400).json({ message: 'Invalid file id' });
    }

    try {
      fs.unlink(path.join('uploads', id), (err) => {
        if (err) {
          console.log('Error deleting file from filesystem:', err);
          return res.status(500).json({ message: 'Unable to delete file' });
        }
        res.json({ message: 'File deleted successfully' });
      });
    } catch (err) {
      console.log('Server error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
];

const downloadFile = [
  param('id').trim().escape(),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    if (!isValidFilename(id)) {
      return res.status(400).json({ message: 'Invalid file id' });
    }

    const filePath = path.join('uploads', id);
    res.download(filePath);
  }
];

const getSignedUrl = [
  param('id').trim().escape(),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    if (!isValidFilename(id)) {
      return res.status(400).json({ message: 'Invalid file id' });
    }

    const signedUrl = `${req.protocol}://${req.get('host')}/api/files/download/${id}`;
    console.log(signedUrl);
    res.json({ url: signedUrl });
  }
];

module.exports = { uploadFile, getFiles, updateFile, deleteFile, downloadFile, getSignedUrl };
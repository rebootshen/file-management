// src/components/Dashboard/UploadFile.js
import React, { useState } from 'react';
import api from '../../api';
import Notification from '../Notification/Notification';
import '../Notification/Notification.css';

const UploadFile = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/files/upload', formData);
      onUpload();
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Failed to upload files', type: 'error' });
    }
  };

  return (
    <div>
      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit">Upload</button>
      </form>
    </div>

  );
};

export default UploadFile;
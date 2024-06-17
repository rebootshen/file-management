// src/components/Dashboard/FileList.js
import React, { useEffect, useState } from 'react';
import api from '../../api';
import Notification from '../Notification/Notification';
import '../Notification/Notification.css';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [newName, setNewName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const fetchFiles = async () => {
    try {
      const response = await api.get('/files');
      setFiles(response.data);
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Failed to fetch files', type: 'error' });
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (filename) => {
    try {
      await api.delete(`/files/${filename}`);
      fetchFiles();
      setNotification({ message: 'File deleted successfully', type: 'success' });
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Failed to delete file', type: 'error' });
    }
  };

  const handleRename = async (filename) => {
    try {
      await api.put(`/files/${filename}`, { newName });
      fetchFiles();
      setNewName('');
      setSelectedFile(null);
      setNotification({ message: 'File renamed successfully', type: 'success' });
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Failed to rename file', type: 'error' });
    }
  };

//   const handleDownload = (filename) => {
//     window.location.href = `${api.defaults.baseURL}/files/download/${filename}`;
//   };

const handleDownload = async (filename) => {
    try {
      const response = await api.get(`/files/signed-url/${filename}`);
      const signedUrl = response.data.url;

      const fileResponse = await api.get(signedUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // or any other extension
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setNotification({ message: 'File downloaded successfully', type: 'success' });
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Failed to download file', type: 'error' });
    }
  };

  return (
    <div>
      <h2>Files</h2>
      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <ul>
        {files.map((file) => (
          <li key={file}>
            {file}
            <button onClick={() => handleDownload(file)}>Download</button>
            <button onClick={() => setSelectedFile(file)}>Rename</button>
            <button onClick={() => handleDelete(file)}>Delete</button>
            {selectedFile === file && (
              <div className="rename-container">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New name"
                />
                <button onClick={() => handleRename(file)}>Submit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
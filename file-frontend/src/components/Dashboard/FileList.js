// src/components/Dashboard/FileList.js
import React, { useEffect, useState } from 'react';
import api from '../../api';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [newName, setNewName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFiles = async () => {
    try {
      const response = await api.get('/files');
      setFiles(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (filename) => {
    try {
      await api.delete(`/files/${filename}`);
      fetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRename = async (filename) => {
    try {
      await api.put(`/files/${filename}`, { newName });
      fetchFiles();
      setNewName('');
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file}>
            {file}
            <button onClick={() => handleDownload(file)}>Download</button>
            <button onClick={() => setSelectedFile(file)}>Rename</button>
            <button onClick={() => handleDelete(file)}>Delete</button>
            {selectedFile === file && (
              <div>
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
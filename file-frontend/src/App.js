// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfile from './components/UserProfile';
import UploadFile from './components/Dashboard/UploadFile';
import FileList from './components/Dashboard/FileList';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>File Management System</h1>
          <p>Upload, download, and manage your files with ease</p>
        </header>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <React.Fragment>
                  <UploadFile onUpload={() => window.location.reload()} />
                  <FileList />
                </React.Fragment>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
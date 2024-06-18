# File Management Application

This is a file management application built with React for the frontend and Node.js/Express for the backend. The application allows users to upload, download, rename, and delete files.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
  - [Backend](#beckend)
  - [Frontend](#frontend)
  - [Using Docker](#using-docker)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- Upload files
- Download files
- Rename files
- Delete files
- Notification system for file operations

## Technologies Used

- Frontend: React, React Testing Library, Jest
- Backend: Node.js, Express, MongoDB, Mongoose, Jest, Supertest

## Getting Started

### Prerequisites

- Node.js (v14 or higher, tested under v20)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:

```bash
    git clone https://github.com/rebootshen/file-management.git
    cd file-management
```

2. Install dependencies for both frontend and backend:

```bash
    cd file-frontend
    npm install

    cd ../file-backend
    npm install
```

### Environment Variables
1. Create a .env file in the file-backend directory and add the following environment variables:
```bash
MONGO_URI=mongodb://localhost:27017/file-management
JWT_SECRET=your_jwt_secret
PORT=5001
```

2. Create a .env.test file in the file-backend directory for testing purposes:
```bash
MONGO_URI=mongodb://localhost:27017/file-management-test
JWT_SECRET=your_jwt_secret
PORT=5002
```

## Running the Application
### Backend

To start the backend server, navigate to the file-backend directory and run:
```bash
npm start
```

### Frontend

To start the frontend development server, navigate to the file-frontend directory and run:
```bash
npm start
```

The application should now be running at http://localhost:3000.

### Using Docker
You can also run the application using Docker. Follow the steps below:

Pull Docker images:
```bash
    docker pull mongo
    docker pull node:20

Build the Docker images:
```bash
    docker-compose build
```

Start the containers:
```bash
    docker-compose up
```
The application should now be running at http://localhost:3000 and the backend at http://localhost:5000.


## Testing
### Backend Tests
To run backend tests, navigate to the file-backend directory and run:
```bash
npm test
```

### Frontend Tests
To run frontend tests, navigate to the file-frontend directory and run:
```bash
npm test
```

## API Endpoints
### User Authentication
POST /api/users/register: Register a new user
POST /api/users/login: Login a user

### File Management
GET /api/files: Get the list of files
POST /api/files/upload: Upload a file
PUT /api/files/:filename: Rename a file
DELETE /api/files/:filename: Delete a file
GET /api/files/signed-url/:filename: Get a signed URL for downloading a file

## Docker
docker pull mongo
docker pull node:20

docker compose build
docker compose up


## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
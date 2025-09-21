# NASA Missions App

A full-stack application for managing NASA missions, built with Node.js, Express, React, and MongoDB. This application features Google OAuth authentication, mission management, and a responsive UI built with Arwes.

## Features

- **User Authentication**: Secure Google OAuth 2.0 login
- **Mission Management**: View and manage space missions
- **Responsive UI**: Built with Arwes design framework
- **Containerized**: Ready for Docker deployment
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Testing**: Comprehensive test suite with Jest and Supertest

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)
- MongoDB (local or cloud instance)
- Google OAuth credentials

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/nasa-missions-app.git
cd nasa-missions-app
```

### 2. Set up the backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/nasa
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   COOKIE_KEY=your_cookie_key
   FRONTEND_URL=http://localhost:3000
   ```

### 3. Set up the frontend

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Development

### Running the application

1. Start the backend server (from the server directory):
   ```bash
   npm run dev
   ```

2. Start the frontend development server (from the client directory):
   ```bash
   npm start
   ```

### Running tests

#### Backend tests
From the server directory:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### Frontend tests
From the client directory:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## Docker Deployment

The application is containerized using Docker and can be run in development or production mode.

### Development with Docker Compose

1. Ensure Docker and Docker Compose are installed
2. From the project root, run:
   ```bash
   docker-compose up --build
   ```
3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - MongoDB: localhost:27017

### Production Deployment

1. Create a `.env` file in the project root with production environment variables
2. Build and start the production containers:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```
3. The production application will be served via Nginx on port 80

## CI/CD

The project includes GitHub Actions workflows for continuous integration and deployment:

- **server-tests.yml**: Runs linting and tests for the backend on every push and pull request
- **client-tests.yml**: Runs linting and tests for the frontend on every push and pull request

### Code Coverage

Code coverage reports are generated during CI and can be viewed in the GitHub Actions logs. For local development, run:

```bash
# From the server directory
npm run test:coverage

# Or for the client
cd client
npm test -- --coverage
```

## Environment Variables

### Server (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| PORT | Port for the Express server | No | 8000 |
| MONGODB_URI | MongoDB connection string | Yes | - |
| GOOGLE_CLIENT_ID | Google OAuth client ID | Yes | - |
| GOOGLE_CLIENT_SECRET | Google OAuth client secret | Yes | - |
| COOKIE_KEY | Secret key for signing cookies | Yes | - |
| FRONTEND_URL | URL of the frontend application | Yes | http://localhost:3000 |
| NODE_ENV | Application environment | No | development |

## API Documentation

### Authentication

- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/current_user` - Get current user information
- `GET /auth/logout` - Logout current user

### Missions API

- `GET /v1/missions` - Get all missions
- `GET /v1/missions/:id` - Get a specific mission
- `POST /v1/missions` - Create a new mission
- `PUT /v1/missions/:id` - Update a mission
- `DELETE /v1/missions/:id` - Delete a mission

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [NASA API](https://api.nasa.gov/) for mission data
- [Arwes](https://arwes.dev/) for the futuristic UI components
- [MongoDB](https://www.mongodb.com/) for the database
- [Docker](https://www.docker.com/) for containerization

## CI/CD

This project uses GitHub Actions for continuous integration. The workflow includes:

- Running tests on every push and pull request
- Using a MongoDB service container for testing
- Caching Node.js dependencies for faster builds

## Environment Variables

### Server

Create a `.env` file in the `server` directory with the following variables:

```
NODE_ENV=development
PORT=8000
MONGO_URL=mongodb://localhost:27017/nasa
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:3000
```

## Project Structure

```
├── client/                 # React frontend
├── server/                 # Express backend
│   ├── src/
│   │   ├── __tests__/     # Test files
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Server entry point
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# NASA Missions App

A full-stack application for managing NASA missions, built with Node.js, Express, React, and MongoDB.

## Features

- User authentication with Google OAuth
- View and manage space missions
- Interactive UI with Arwes design system

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Google OAuth credentials

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/express-course1.git
   cd express-course1
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `server` directory based on `.env.example`
   - Add your Google OAuth credentials

5. Start the development servers:
   ```bash
   # In the server directory
   npm run dev
   
   # In a new terminal, in the client directory
   npm start
   ```

## Testing

Run the test suite:

```bash
# Server tests
cd server
npm test

# Client tests (when available)
cd ../client
npm test
```

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

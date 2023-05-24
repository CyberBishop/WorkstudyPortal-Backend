# CU Workstudy Portal

The Covenant University Workstudy Portal is a web application that facilitates the management of the work-study program at Covenant University. It provides features for user registration, login, attendance tracking, and user management.

## Table of Contents

-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Getting Started](#getting-started)
-   [Environment Variables](#environment-variables)
-   [API Endpoints](#api-endpoints)
-   [Contributing](#contributing)
-   [License](#license)

## Features

-   User registration and login functionality
-   User roles (student, admin) with corresponding access control
-   Attendance tracking for work-study sessions
-   User management (admin-only)
-   API endpoints for user-related operations
-   API endpoints for attendance-related operations

## Technologies Used

-   Node.js
-   Express.js
-   MongoDB (with Mongoose)
-   JSON Web Tokens (JWT) for authentication
-   Bcrypt.js for password hashing
-   Cors for enabling cross-origin resource sharing

## Getting Started

To get started with the CU Workstudy Portal, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/cu-workstudy.git`
2. Install the dependencies: `npm install`
3. Create a `.env` file based on the provided example (see below) and set the required environment variables.
4. Start the server: `npm start`
5. Access the application at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory of the project and provide the following environment variables:

PORT= 3000

MONGODB_URI= `<your-mongodb-connection-string>`

JWT_SECRET= `<your-jwt-secret>`

Replace `<your-mongodb-connection-string>` with your actual MongoDB connection string and `<your-jwt-secret>` with your desired JWT secret.

## API Endpoints

The API endpoints for the CU Workstudy Portal are defined in the route files. Here are some example endpoints:

-   `POST /user/register`: Register a new user.
-   `POST /login`: Log in as a user and obtain an access token.
-   `PUT /user/:username`: Update user details (admin-only).
-   `GET /user/verify`: Verify a user's token.
-   `GET /user`: Get user details.
-   `GET /users`: Get all users (admin-only).
-   `GET /users/:placement`: Get users by placement.

For detailed information about the API endpoints, please refer to the corresponding route files.

## Contributing

Contributions to the CU Workstudy Portal are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

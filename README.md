# Few Peanuts

## Description

This project is a website that serves as a platform for employees to voice their experiences with their employers. It aims to provide a space for workers who have been exploited or not treated according to proper standards to share their stories, rate their employers, and bring awareness to workplace conditions. By enabling employees to speak out, this platform fosters transparency and accountability in the workplace.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fewpeanuts/fp-backend
   cd your-repo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the `config/` directory.
   - Add required environment variables
     - PORT=4000
     - NODE_ENV=development
     - MONGO_URL

## Usage

To run in development mode:

```bash
npm run dev
```

## API Endpoints

### Admin Endpoints

| Method | Endpoint                     | Description                          |
| ------ | ---------------------------- | ------------------------------------ |
| POST   | `/user/admin/login`          | Admin login                          |
| POST   | `/business/admin/create`     | Create a new business (Admin only)   |
| GET    | `/business//admin/list`      | Get business list (Admin only)       |
| PUT    | `/business/admin/update`     | Update business details (Admin only) |
| DELETE | `/business/admin/delete/:id` | Delete business (Admin only)         |
| POST   | `/question/admin/create`     | Create a new question (Admin only)   |
| PUT    | `/question/admin/update`     | Update question (Admin only)         |
| DELETE | `/question/admin/delete/:id` | Delete question (Admin only)         |
| GET    | `/review/admin/list`         | Get list of reviews (Admin only)     |

### User Endpoints

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| POST   | `/user/register`       | Register a new user        |
| POST   | `/user/login`          | User login                 |
| GET    | `/user/profile`        | Get logged-in user profile |
| GET    | `/user/profile/:id`    | Get user profile by ID     |
| PUT    | `/user/profile/update` | Update user profile        |

### Business Endpoints

| Method | Endpoint                   | Description               |
| ------ | -------------------------- | ------------------------- |
| GET    | `/business/list`           | Get list of businesses    |
| POST   | `/business/request-to-add` | Request to add a business |

### Question Endpoints

| Method | Endpoint                | Description                                 |
| ------ | ----------------------- | ------------------------------------------- |
| GET    | `/question/review/list` | Get list of questions (Authenticated users) |

### Review Endpoints

| Method | Endpoint                       | Description                            |
| ------ | ------------------------------ | -------------------------------------- |
| POST   | `/review/create`               | Create a review (Authenticated users)  |
| GET    | `/review/list/:businessId`     | Get reviews for a specific business    |
| GET    | `/review/review-stats`         | Get overall business review statistics |
| POST   | `/review/:reviewId/vote`       | Vote on a review (Authenticated users) |
| GET    | `/review/:reviewId/vote-stats` | Get review vote statistics             |

## Project Structure

```
backend/
│── config/           # Configuration files
│── src/
│   │── db/
│   │   └── mongolize.js          # Database connection and configuration
│   │
│   │── middleware/
│   │   └── auth.js               # Authentication middleware
│   │
│   │── models/
│   │   ├── Business.js           # Business model
│   │   ├── Otp.js                # OTP model
│   │   ├── Question.js           # Question model
│   │   ├── Review.js             # Review model
│   │   └── User.js               # User model
│   │
│   │── routes/
│   │   ├── business/
│   │   │   ├── business.js       # Business-related routes
│   │   │   └── index.js          # Business route index
│   │   ├── question/
│   │   │   ├── question.js       # Question-related routes
│   │   │   └── index.js          # Question route index
│   │   ├── reviews/
│   │   │   ├── helper.js         # Review helper functions
│   │   │   ├── review.js         # Review-related routes
│   │   │   └── index.js          # Review route index
│   │   ├── user/
│   │   │   ├── user.js           # User-related routes
│   │   │   └── index.js          # User route index
│   │   ├── utils.js              # Utility functions
│   │
│   │── utils/
│   │   └── index.js              # Utility functions index
│
│── package.json                  # Project metadata and dependencies
```

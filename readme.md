# Tourism Management System - Backend

This is the backend service for the Tourism Management System, responsible for handling the server-side logic, database interactions, and API functionalities.

## 🌟 Features

- **RESTful APIs:** Provides endpoints for managing tours, users, bookings, and admin functionalities.
- **Secure Authentication:** Utilizes Firebase Authentication for secure user login and signup.
- **Database Management:** Handles data storage, retrieval, and updates using MongoDB.
- **Real-Time Updates:** Ensures instant updates for booking statuses and user actions.
- **Error Handling:** Comprehensive error handling ensures smooth operation and meaningful feedback.

---

## 🛠️ Technologies Used

- **Backend Framework:**
  - Node.js with Express.js
- **Database:**
  - MongoDB (NoSQL Database)
- **Authentication:**
  - Firebase Authentication
- **Other Tools:**
  - Mongoose (MongoDB ORM)
  - Dotenv (Environment Variables)
  - Cors (Cross-Origin Resource Sharing)
  - Bcrypt (Password Hashing)

---

## 📖 API Endpoints

### Authentication
| Method | Endpoint         | Description            |
|--------|------------------|------------------------|
| POST   | `/api/auth/login` | User login            |
| POST   | `/api/auth/signup`| User registration     |

### Tours
| Method | Endpoint         | Description            |
|--------|------------------|------------------------|
| GET    | `/api/tours`      | Fetch all tours       |
| GET    | `/api/tours/:id`  | Fetch tour by ID      |
| POST   | `/api/tours`      | Add a new tour        |
| PUT    | `/api/tours/:id`  | Update tour details   |
| DELETE | `/api/tours/:id`  | Delete a tour         |

### Bookings
| Method | Endpoint         | Description                   |
|--------|------------------|-------------------------------|
| GET    | `/api/bookings`   | Fetch all bookings           |
| POST   | `/api/bookings`   | Create a new booking         |
| GET    | `/api/bookings/:id`| Fetch booking by ID         |
| DELETE | `/api/bookings/:id`| Cancel a booking            |

### Admin
| Method | Endpoint         | Description                  |
|--------|------------------|------------------------------|
| GET    | `/api/admin/users`| Fetch all users (Admin only)|
| DELETE | `/api/admin/users/:id`| Delete user (Admin only)|

---

## 🗂️ Project Structure


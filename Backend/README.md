# LifeLine24x7 Backend

Backend API for the LifeLine24x7 Hospital Management System.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/sbr69/LifeLine24x7.git
cd LifeLine24x7/Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Create database**
```bash
sudo -u postgres psql
CREATE DATABASE lifeline_db;
\q
```

5. **Initialize database schema**
```bash
npm run init-db
```

6. **Start the server**
```bash
npm start        # Production
npm run dev      # Development (with auto-reload)
```

## API Endpoints

### Authentication

#### Register Hospital
```
POST /api/auth/register
```
**Request Body:**
```json
{
  "hospitalName": "City Hospital",
  "email": "admin@hospital.com",
  "contactNumber": "1234567890",
  "address": "123 Main St, City",
  "icuBeds": "10",
  "hduBeds": "15",
  "generalBeds": "50",
  "password": "securepassword"
}
```

#### Login
```
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "admin@hospital.com",
  "password": "securepassword"
}
```

## Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   ├── database.js         # Database connection
│   │   └── initDb.js           # Database initialization
│   ├── middleware/
│   │   └── errorHandler.js     # Error handling
│   └── modules/
│       └── auth/
│           ├── index.js        # Auth routes
│           ├── register/       # Registration module
│           └── login/          # Login module
├── .env.example                # Environment template
├── .gitignore
├── package.json
├── server.js                   # Entry point
└── README.md
```

## Database Schema

### hospitals
- `id` - SERIAL PRIMARY KEY
- `hospital_name` - VARCHAR(255)
- `email` - VARCHAR(255) UNIQUE
- `contact` - BIGINT
- `hospital_address` - TEXT
- `icu_beds` - INTEGER
- `hdu_beds` - INTEGER
- `general_beds` - INTEGER
- `password` - VARCHAR(255) (hashed)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

## Security Features

- Password hashing using bcrypt
- SQL injection prevention (parameterized queries)
- CORS protection
- Input validation
- Error handling middleware

## License

This project is for educational purposes.


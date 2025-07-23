

# EasyGenerator Backend Task

## Features
- User authentication with JWT in cookies and CSRF protection
- Signup with email verification (OTP sent via email)
- Login, logout, resend OTP, verify OTP
- Secure endpoints with JWT and CSRF guards
- User profile endpoint (protected)
- Modular NestJS structure (Redis, Email, Auth, Users)
- Swagger API documentation

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd easygenerator-backend-task
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
- Copy `.env.example` to `.env` and fill in your secrets:
```bash
cp .env.example .env
```
- Edit `.env` as needed (MongoDB, Redis, SMTP, JWT, etc.)

### 4. Run the project
```bash
npm run start:dev
```

### 5. Access Swagger API docs
- Visit [http://localhost:5000/api/docs](http://localhost:5000/api/docs) in your browser.

## Docker

To build and run with Docker:
```bash
docker build -t easygenerator-backend .
docker run --env-file .env -p 5000:5000 easygenerator-backend
```

## CI/CD (GitHub Actions)
- The project includes a simple GitHub Actions workflow for CI/CD.
- On push to `main`, it will install dependencies, run lint, build, and test.
- You can extend the workflow for deployment as needed.

---

**For production:**
- Set `NODE_ENV=production` in your `.env`.
- Use HTTPS and configure CORS origins properly.
- Use strong secrets for JWT and session.
- Set up SMTP and Redis for email/OTP and session/OTP storage.

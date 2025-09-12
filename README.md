# Paytm Wallet Fullstack Application

A full-stack wallet application where users can register, login, deposit money, and send virtual money to other users. Built with **MERN stack** (MongoDB, Express, React, Node.js) with full authentication.

## Features

- User Signup, Signin, and Profile management.
- OTP verification and password reset functionality.
- Protected routes for authenticated users.
- Deposit money into your wallet.
- Send money to other users with transaction history.
- Search users functionality.
- Validation for balance limits and transaction amounts.

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JWT (Cookies based)
- **Version Control:** Git & GitHub

## API Endpoints

### Auth Routes

- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/verify` - Verify user (OTP)
- `POST /api/v1/auth/signin` - Login user
- `POST /api/v1/auth/forgot-password` - Initiate password reset
- `POST /api/v1/auth/verify-otp` - Verify OTP for reset
- `PATCH /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/auth/profile` - Get logged-in user profile

### User Routes

- `GET /api/v1/users/all` - Get all users (searchable)
- `GET /api/v1/users/:id` - Get a particular user (for sending money)
- `POST /api/v1/users/send/:id` - Send money to a user
- `POST /api/v1/users/deposite/wallet` - Deposit money into your wallet

## Setup & Usage

1. Clone the repository:

```bash
git clone https://github.com/anshumaan-rex/paytm-wallet-fullstack.git
cd paytm-wallet-fullstack

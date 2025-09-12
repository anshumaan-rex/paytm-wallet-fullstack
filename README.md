# Paytm Wallet Fullstack Application

A full-stack wallet application where users can register, login, deposit money, and send virtual money to other users. Built with **MERN stack** (MongoDB, Express, React, Node.js) with full authentication.

## Features

- User Signup and Login with JWT authentication.
- Protected routes for authenticated users.
- Deposit money into your wallet.
- Send money to other users with transaction history.
- User search functionality.
- Validation for balance limits and transaction amounts.
- Transactions stored in MongoDB with sender and receiver references.

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JWT (Cookies based)
- **Version Control:** Git & GitHub

## API Endpoints

### Auth

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User

- `GET /api/users` - Get all users (searchable by name or username)
- `GET /api/users/:id` - Get a particular user (for sending money)
- `POST /api/users/deposit` - Deposit money into your wallet
- `POST /api/users/send/:id` - Send money to a particular user

### Transaction

- `GET /api/transactions` - Get all transactions for logged-in user

## Usage

1. Clone the repository:

```bash
git clone https://github.com/anshumaan-rex/paytm-wallet-fullstack.git
cd paytm-wallet-fullstack
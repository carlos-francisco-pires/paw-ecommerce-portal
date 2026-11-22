# PAW E-commerce Portal

Full-stack e-commerce web portal for an IT products store, built individually for the **Web Programming (PAW)** course at ESTG – Politécnico do Porto.

The application supports four user roles (customer, store staff, delivery courier and administrator), each with its own area and permissions, and covers the full flow from browsing the catalogue to delivering an order.

> The tag `v1.0-paw` marks the version submitted for the course. Later commits are personal improvements.

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | Angular, TypeScript, Angular Material, Bootstrap |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication | JWT, bcrypt, role-based access control |
| Other | Multer (image uploads), Swagger / OpenAPI (API documentation) |

## Features

**Customers**
- Browse the catalogue with search (by name or EAN), category filter, price sorting and pagination
- Product details with configurable options (extra cost per option)
- Compare products side by side
- Shopping cart and checkout with a choice of delivery method
- Track and cancel orders, edit profile and change password
- Personal dashboard

**Store staff**
- Manage products (with image uploads), categories and delivery methods
- Manage orders and update their status
- Store dashboard

**Delivery couriers**
- View assigned deliveries and update their status
- Courier dashboard

**Administrators**
- Manage users and store settings
- Admin dashboard, plus access to all store management features

**Order lifecycle:** pending → confirmed → in preparation → out for delivery → delivered (or cancelled)

## Project structure

```
paw-ecommerce-portal/
├── backend/            # REST API (Node.js + Express)
│   ├── controllers/
│   ├── middleware/     # JWT authentication and role checks
│   ├── models/         # Mongoose models (User, Product, Order, ...)
│   ├── routes/         # API endpoints, documented with Swagger
│   ├── uploads/        # Product images (not versioned)
│   └── server.js
└── frontend/           # Angular single-page application
    └── src/app/
        ├── shop/         # Catalogue, product details, cart, checkout, compare
        ├── client-area/  # Customer profile, orders and dashboard
        ├── admin/        # Store and admin management pages
        ├── delivery/     # Courier pages
        └── auth/         # Login and registration
```

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS) and npm
- A MongoDB database (local installation or MongoDB Atlas)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # on Windows: copy .env.example .env
```

Fill in the values in `.env` (MongoDB connection string and a JWT secret), then start the server:

```bash
npm run dev
```

The API runs at `http://localhost:3000` and the interactive documentation is available at `http://localhost:3000/api-docs`.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200` in your browser.

## Future improvements

- [ ] Automated tests for the API and the frontend
- [ ] Online demo deployment
- [ ] Screenshots and a short demo in this README

## Author

**Carlos Francisco Pires**, Computer Engineering student at ISEP
[LinkedIn](https://www.linkedin.com/in/carlos-francisco-pires)

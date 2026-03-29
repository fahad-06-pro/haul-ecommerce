# Haul - E-Commerce Store

A full stack e-commerce web application built with the MERN stack.

## Live Demo
- Frontend: (coming soon)
- Backend API: (coming soon)

## Features

### Customer
- User registration and login
- Browse products with search, filter and pagination
- Product detail page with reviews and ratings
- Add to cart and manage cart
- Wishlist — add/remove products
- Checkout with shipping address
- Coupon code discount system
- Cash on delivery and Stripe payment
- Order tracking and history
- Update profile and address

### Admin
- Admin dashboard with stats
- Manage products — add, edit, delete with image upload
- Manage categories
- Manage orders — update order status
- Manage coupons — create and delete

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- Stripe.js

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image upload)
- Stripe (payment)
- Nodemailer (email)

## Project Structure
```
haul/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        └── pages/
```

## Setup

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## Screenshots
Coming soon

## Author
Fahad Ali — Full Stack MERN Developer

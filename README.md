# Commodity

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Phases & Progress](#project-phases--progress)
- [Getting Started](#getting-started)
- [Contact](#contact)

---

## About

**Commodity** is a modern e-commerce platform built with the MERN stack, focused on delivering a smooth shopping experience for users and providing admin tools for inventory and order management. The project aims to support secure transactions, smart search, precise delivery locations, and real-time communication, blending performance and usability for both customers and administrators.

---

## Features

### Core Features

- **User Authentication**: Register and log in securely using JWT.
- **Admin Panel**: Admins can log in and manage inventory and listings.
- **Product Listings**: Public landing page showcasing available products.
- **Product Details Page**: View individual product descriptions, pricing, and availability.
- **Shopping Cart**: Add, update, or remove products before checkout.
- **Inventory Management (Admin)**: Add, update, or delete products and manage stock levels.
- **Payment Integration**: Secure payment processing through a payment gateway.
- **Location-Aware Delivery**: Users input precise delivery details via interactive maps.
- **Advanced Search and Filtering**: Quickly find products using keyword and category filters.
- **Live Chat & Support**: Real-time messaging between users and customer support or sellers.
- **OAuth 2.0**: Social login via platforms like Google or Facebook (planned).

---

## Technology Stack

### Frontend

- **Next.js**: React framework with server-side rendering and optimized performance.
- **App Router**: Next.js routing for modular and scalable architecture.
- **Shadcn UI**: Stylish, accessible components built with Radix UI and Tailwind CSS.
- **Formik + Yup**: Form state management and schema-based validation.
- **Axios**: API request handling.
- **Redux**: Centralized state management.

### Backend

- **Node.js**: JavaScript runtime for the backend.
- **Express.js**: Lightweight server-side framework.
- **Mongoose**: MongoDB object modeling.
- **bcrypt**: Secure password hashing.
- **jsonwebtoken (JWT)**: User and admin authentication via tokens.

### Database

- **MongoDB**: NoSQL document-based database.

---

## Project Phases & Progress

### Phase 1: Core Authentication, Product Listings, and Inventory (🚧 In Progress)

**Objectives**:

- Build user flow for shopping
- Admin inventory control
- Secure authentication

**Progress**:

- ✅ User Registration/Login with JWT
- ✅ Display product list on landing page
- ✅ View product detail page
- ✅ Admin login/authentication
- ✅ Add-to-cart and cart management
- ✅ Admin: Add/Edit/Delete products
- ✅ Inventory count update, post-order

---

### Phase 2: Payment, Search, and Location Features

**Objectives**:

- Enable real orders
- Improve discovery and delivery accuracy

**Planned**:

- ✅ Simulate Payment
- ✅ Interactive maps for delivery address input (Leaflet and GeoApify)
- ✅ Advanced search with filters (category, price, etc.)

---

### Phase 3: Communication, Support, and Enhanced Security

**Objectives**:

- Foster trust and usability

**Planned**:

- ⬜ Real-time chat between users and sellers/support
- ⬜ OAuth 2.0 login (Google, Facebook, etc.)
- ✅ In-app notifications (optional enhancement)

---

## Getting Started

To run the app locally:

### Prerequisites

- Node.js (LTS recommended)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/angeltamang123/Commodity
   cd commodity
   ```

2. **Backend Setup**:

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `backend` folder with:

   ```env
   JWT_SECRET=your_jwt_secret_key
   ```

   Start the backend server:

   ```bash
   npm run dev
   ```

3. **Frontend Setup**:

   ```bash
   cd ../client
   npm install
   ```

   Create a `.env` file in the `backend` folder with:

   ```env
   NEXT_PUBLIC_EXPRESS_API_URL="http://localhost:7000"
   ```

   Start the frontend dev server:

   ```bash
   npm run dev
   ```

   Open in your browser: `http://localhost:3000`

---

## Contact

If you'd like to contribute or have any questions:

- **Project Name**: Commodity
- **Maintainer**: Angel Tamang
- **Email**: tamangangel2057@gmail.com
- **GitHub**: https://github.com/angeltamang123

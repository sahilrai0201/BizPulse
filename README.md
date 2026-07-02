# Bizz Project

A full-stack business dashboard and invoicing application with React frontend and Node.js/Express backend.

## Project Structure

- `Frontend/` - React application built with Vite, Tailwind CSS, Bootstrap and Recharts.
- `Backend/` - Express API server with MongoDB integration.

## Features

- Product, product category, and customer management
- Invoice creation and management
- User authentication support (JWT)
- Dashboard analytics and charts
- Responsive admin interface

## Tech Stack

- Frontend
  - React
  - Vite
  - Tailwind CSS
  - Bootstrap
  - Recharts
  - Axios
  - React Router

- Backend
  - Node.js
  - Express
  - MongoDB / Mongoose
  - dotenv
  - bcryptjs
  - jsonwebtoken
  - cors

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database available

### Backend Setup

1. Navigate to `Backend`

```bash
cd Backend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file with a MongoDB connection string

```env
MONGO_URI=your_mongodb_connection_string
```

4. Start the API server

```bash
node index.js
```

The backend server listens on `http://localhost:8088`.

### Frontend Setup

1. Navigate to `Frontend`

```bash
cd Frontend
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The frontend runs on Vite and expects the backend at `http://localhost:8088`.

## API Endpoints

The backend exposes routes under `/api/v1`.

- `POST /api/v1/user` - User operations
- `POST /api/v1/product` - Product operations
- `POST /api/v1/productCategory` - Product category operations
- `POST /api/v1/customer` - Customer operations
- `POST /api/v1/invoice` - Invoice operations

> Exact endpoint methods and request shapes are defined in `Backend/routes/*.js`.

## Notes

- The backend uses `cors` to allow requests from the frontend origin `http://localhost:5173`.
- Update the frontend or backend origin as needed when deploying.

## License

This project uses the ISC license by default.

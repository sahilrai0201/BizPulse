# BizPulse (Bizz Project) 🚀

A modern, full-stack business dashboard, invoicing, and customer management application built with a React frontend and a Node.js/Express backend. BizPulse features AI-powered invoice receipt scanning (OCR), dynamic AI email reminder generation, automatic in-memory database fallbacks, and real-time dashboard analytics.

---

## 🌟 Key Highlights & Architecture

- **🔌 Plug-and-Play Database Fallback:** The backend attempts to connect to your MongoDB Atlas cluster (`MONGO_URI`). If Atlas is unavailable or times out (after 3.5 seconds), it automatically spins up a local, in-memory MongoDB database using `mongodb-memory-server`.
- **🌱 Automated Seed Database:** On first boot, the system automatically checks for the existence of a default business user account (`demo@bizz.com`). If missing, it seeds the user and creates realistic mock product categories (Electronics, Clothing, Books), products, customers, and historical invoices so the charts and dashboard are immediately interactive.
- **✨ Gemini AI Integrations:** 
  - **AI Receipt OCR Scanner:** Users can upload or drop an image of an invoice receipt, which is processed by Google's `gemini-1.5-flash` model to automatically extract billing address, client info, individual line items, subtotal, and total amount to populate form fields instantly.
  - **AI Billing Reminders:** Select an invoice and generate customized email billing notifications using Gemini AI, with tone options like *Friendly*, *Professional*, or *Firm*.
- **✉️ Automated Notifications:** Invoices can be compiled into elegant HTML emails and dispatched to customers via Nodemailer, using Ethereal Test Mailer for previewing and local debugging.
- **🔒 Secure Authentication:** Handled via JSON Web Tokens (JWT). The frontend utilizes a global Axios interceptor to automatically attach authorization headers for protected routes. A bypass token (`demo-token`) is built-in for the demo user profile.
- **📊 Interactive Charts:** Key metrics (Revenues, sales trends, inventory composition, demographic segmentation, etc.) are rendered using beautiful interactive charts powered by Recharts and Framer Motion.

---

## 📁 Project Structure

```text
Bizz_Project-main/
├── Backend/                 # Node.js + Express API server
│   ├── controllers/         # Request handling logic & business services
│   ├── middleware/          # JWT protect guards and authentication logic
│   ├── models/              # Mongoose data schemas (User, Customer, Product, Invoice, etc.)
│   ├── routes/              # Express route mappings
│   ├── utils/               # Database seeder utility & helpers
│   ├── db.js                # DB connection engine (Atlas connection & Local memory fallback)
│   ├── index.js             # Main server entrypoint
│   └── package.json         # Backend dependencies & run scripts
│
├── Frontend/                # Vite + React Single-Page Application (SPA)
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # UI components grouped by feature (Invoice, analytics, overview, etc.)
│   │   ├── pages/           # Dashboard views (Overview, Invoices, Products, Sales, Analytics, Settings, etc.)
│   │   ├── App.jsx          # Route declarations & layout structure
│   │   ├── main.jsx         # React bootstrapping & global Axios interceptor config
│   │   └── index.css        # Global CSS stylesheet & styling imports
│   ├── tailwind.config.js   # Tailwind style customizations
│   └── package.json         # Frontend dependencies & Vite setup
```

---

## 🛠️ Tech Stack

### Frontend
- **React (v18.3.1) & Vite:** High-performance rendering engine and bundler.
- **Tailwind CSS & Bootstrap:** Clean, modern responsive styling.
- **Framer Motion:** High-fidelity micro-interactions and transitions.
- **Recharts:** Highly customizable charts and data visualization.
- **Lucide React & React Icons:** Extensive icons library.
- **Axios:** Async HTTP client configured with a global request interceptor.
- **React Router Dom:** Single-page application routing and route guards.
- **jsPDF & HTML2Canvas:** Client-side invoice export to PDF documents.

### Backend
- **Node.js & Express:** Lightweight, asynchronous server.
- **MongoDB / Mongoose:** Scalable Document Store & Object Data Modeling.
- **Nodemailer:** Automated SMTP transaction email dispatch.
- **Google Generative AI (Gemini):** Core model engine for OCR and content creation.
- **BcryptJS & JSONWebToken:** Password encryption and secure session validation.
- **Cors & Dotenv:** Cross-Origin Resource Sharing handling and environment configuration.
- **MongoDB Memory Server (Dev):** Zero-config fallback database server.

---

## ⚙️ Environment Configuration

### Backend Setup
Create a file named `.env` in the `Backend/` directory:

```env
# Server Port (Default is 8088 in index.js)
PORT=8088

# JWT Key configuration
JWT_SECRET=your_jwt_signature_key

# MongoDB Connection String (If omitted/invalid, server falls back to in-memory database)
MONGO_URI=your_mongodb_atlas_connection_string

# Gemini API Key (Required for receipt OCR scanner & AI email draft generation)
GEMINI_API_KEY=your_google_gemini_api_key
```

### Frontend Setup
Create a development config file named `.env.development` in the `Frontend/` directory:

```env
VITE_BASE_URL=http://localhost:8088
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed on your local machine.

### Step 1: Clone and Install Dependencies
Install modules for both services by running:

```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### Step 2: Running the Services

1. **Start the Backend API Server:**
   ```bash
   cd Backend
   npm start
   ```
   *Note: If no custom `MONGO_URI` is provided, you will see a log notifying that the database has successfully fallen back to the local in-memory DB and seeded dummy records.*

2. **Start the Frontend Application:**
   ```bash
   cd Frontend
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

### 🔑 Demo Login Credentials
For rapid evaluation, you can bypass manual registration and sign in with the seeded accounts:
- **Email:** `demo@bizz.com`
- **Password:** `demo1234`

---

## 🔌 API Endpoints Reference

All routes are mounted under the base path `/api/v1`.

### 👤 Authentication & User Routes (`/api/v1/user`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---|
| `POST` | `/` | Registers a new Business User profile | No |
| `POST` | `/login` | Authenticates User credentials and returns a JWT session token | No |
| `GET` | `/profile` | Returns details of the logged-in User profile | **Yes (JWT)** |
| `GET` | `/get/:id` | Returns user info matching specific ID | No |
| `PUT` | `/update/:id` | Updates business info | No |
| `DELETE` | `/deleate/:id` | Deletes user record | No |
| `DELETE` | `/logout` | Destroys session | No |

### 📦 Product Inventory Routes (`/api/v1/product`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---|
| `POST` | `/` | Registers a new product inventory card | **Yes (JWT)** |
| `GET` | `/get/:id` | Fetches details of a single product | **Yes (JWT)** |
| `GET` | `/getall` | Fetches all products matching the logged-in User | **Yes (JWT)** |
| `PUT` | `/update/:id` | Modifies existing product properties | **Yes (JWT)** |
| `DELETE` | `/deleate/:id` | Deletes an inventory product | **Yes (JWT)** |

### 📁 Product Categories (`/api/v1/productCategory`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---|
| `POST` | `/` | Creates a new category (e.g. name, GST rate mapping) | No |
| `PATCH` | `/update/:id` | Updates category configurations | No |
| `DELETE` | `/delete/:id` | Deletes specific category metadata | No |

### 👥 Client & Customer Routes (`/api/v1/customer`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---|
| `POST` | `/` | Registers a new Customer/Client profile | **Yes (JWT)** |
| `GET` | `/getall` | Retrieves directory list of all customers | **Yes (JWT)** |
| `GET` | `/get/:id` | Retrieves customer profile details | **Yes (JWT)** |
| `PUT` | `/update/:id` | Updates billing credentials or addresses | **Yes (JWT)** |
| `DELETE` | `/deleate/:id` | Deletes a customer profile | **Yes (JWT)** |

### 📄 Invoices & AI Scanner Routes (`/api/v1/invoice`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---|
| `POST` | `/register` | Save/register a completed invoice details structure | **Yes (JWT)** |
| `POST` | `/scan` | Receives image data payload & utilizes Gemini AI to parse data fields | **Yes (JWT)** |
| `GET` | `/` | Retrieves invoice lists | **Yes (JWT)** |
| `GET` | `/:id` | Gets details for specific Invoice ID | **Yes (JWT)** |
| `PUT` | `/:id` | Updates invoice parameters | **Yes (JWT)** |
| `DELETE` | `/:id` | Deletes a generated invoice record | **Yes (JWT)** |

### 📊 Analytics Routes (`/api/v1/analytics`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---|
| `GET` | `/overview` | Aggregates Total Revenues, Product counts, and customer counts | **Yes (JWT)** |
| `GET` | `/sales-trend` | Compiles sales totals grouped chronologically by month | **Yes (JWT)** |
| `GET` | `/categories` | Aggregates inventory composition ratios for charts rendering | **Yes (JWT)** |

### ✉️ Email Notifications & AI Reminders (`/api/v1/email`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---|
| `POST` | `/:id/email` | Renders invoice invoice summary into HTML template and sends via Nodemailer | **Yes (JWT)** |
| `POST` | `/:id/ai-draft` | Communicates with Gemini AI to generate custom email reminder templates (Friendly/Firm/Professional) | **Yes (JWT)** |
| `POST` | `/:id/send-custom` | Submits modified user text body and subject line to customer email | **Yes (JWT)** |

---

## 📝 Troubleshooting & Offline Usage

- **Local MongoDB Falls Back Automatically:** You do not need to run a local Mongo instance to run the developer server. The server initializes in-memory database engines cleanly.
- **AI OCR Failures:** If your Gemini API Key is invalid or expired, the backend automatically intercepts errors and provides a fully structured mock invoice result to guarantee a smooth and interruption-free presentation.
- **Email testing logs:** Ethereal Email URLs will print directly to the console. Look for `Ethereal URL: https://ethereal.email/message/...` inside backend process console log output to preview drafts exactly as they would appear to your clients.

---

## 📄 License
Distributed under the ISC License. See `Backend/package.json` for details.

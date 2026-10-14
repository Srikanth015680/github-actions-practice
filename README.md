# ShopFlow — Full-Stack Shopping App

React + Vite frontend and Node.js + Express backend. This starter uses in-memory products/cart data so you can add MongoDB later.

## Run locally
Backend terminal:
```bash
cd backend
npm install
npm run dev
```
Frontend terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173 | Backend: http://localhost:4000/health

## Tests
Run `npm test` inside both `backend` and `frontend` folders.

## Docker
From the project root run `docker compose up --build`. Open http://localhost:8080.
The frontend Nginx container proxies `/api` to the backend.

## MongoDB
Create `backend/.env` from `.env.example`, add `MONGODB_URI=your_connection_string`, then integrate Mongoose/models. The starter does not connect to MongoDB yet. Never commit `.env` or expose database credentials.

## API
GET `/health`, GET `/api/products`, GET `/api/products/:id`, GET `/api/cart`, POST `/api/cart/items`, PATCH `/api/cart/items/:productId`, DELETE `/api/cart/items/:productId`, DELETE `/api/cart`.
# github-actions-practice

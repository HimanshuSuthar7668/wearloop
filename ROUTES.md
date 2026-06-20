# API Routes Documentation

This document lists all available API endpoints, their methods, request structures, and sample responses.

The base URL for all routes is: `http://localhost:5000`

---

## Authentication

All routes except **Products** and **Auth** require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained via the `/auth/login` endpoint and expire after **24 hours**.

---

## 1. Auth Routes (`/auth`)

### Register

Creates a new user account with a hashed password.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "user"
  }
  ```
  > `role` is optional and defaults to `"user"`. Accepted values: `"user"`, `"admin"`.
- **Response (Success - 201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
      }
    }
  }
  ```
- **Response (Error - 400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Email is already registered"
  }
  ```

### Login

Authenticates a user and returns a JWT token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Response (Error - 400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Invalid email or password"
  }
  ```

---

## 2. User Routes (`/users`)

### Get All Users

Retrieves a list of all registered users. **Restricted to admin users only.**

- **URL**: `/users`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Role Required**: `admin`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "created_at": "2026-06-11T10:00:00.000Z",
        "updated_at": "2026-06-11T10:00:00.000Z"
      }
    ]
  }
  ```
- **Response (Error - 401 Unauthorized)**:
  ```json
  {
    "success": false,
    "message": "Authorization token required"
  }
  ```
- **Response (Error - 403 Forbidden)**:
  ```json
  {
    "success": false,
    "message": "Forbidden: You do not have permission to access this resource"
  }
  ```

---

## 3. Product Routes (`/products`)

### Get All Products

Retrieves a list of all products. **Public — no authentication required.**

- **URL**: `/products`
- **Method**: `GET`
- **Auth Required**: No
- **Headers**: `Content-Type: application/json`
- **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Product A",
        "stock": 10,
        "created_at": "2026-06-11T10:00:00.000Z"
      }
    ]
  }
  ```

---

## 4. Order Routes (`/orders`)

### Create Order

Creates a new order with one or more items. The `userId` is automatically derived from the authenticated user's token.

- **URL**: `/orders`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "items": [
      {
        "productId": 1,
        "days": 3
      }
    ]
  }
  ```
- **Response (Success - 201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "orderId": 42,
      "totalAmount": 150
    }
  }
  ```
- **Response (Error - 400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Product 1 is out of stock"
  }
  ```

### Cancel Order

Cancels an order and initiates refund logic. Restores product stock. **Only the order owner or an admin can cancel.**

- **URL**: `/orders/:id/cancel`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **URL Params**: `id` (Order ID, e.g. `/orders/42/cancel`)
- **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "orderId": 42,
      "status": "cancelled",
      "refundAmount": 150
    }
  }
  ```
- **Response (Error - 400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "You do not have permission to cancel this order"
  }
  ```

### Get Order History

Retrieves paginated order history for the authenticated user. Admin users can query any user's history by passing `userId` as a query parameter.

- **URL**: `/orders`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Query Parameters**:
  - `userId` (number, optional — admin only, to view another user's orders)
  - `page` (number, optional, default: `1`)
  - `limit` (number, optional, default: `5`)
- **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "orderId": 42,
        "status": "completed",
        "totalAmount": "150.00",
        "createdAt": "2026-06-11T11:00:00.000Z",
        "items": [
          {
            "productId": 1,
            "name": "Product A",
            "days": 3,
            "price": "50.00"
          }
        ]
      }
    ]
  }
  ```

---

## 5. Payment Routes (`/payments`)

### Process Payment

Processes a payment for an order using a unique transaction ID. Prevents duplicate transactions and updates order status.

- **URL**: `/payments`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "orderId": 42,
    "transactionId": "tx_abc123xyz"
  }
  ```
- **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "orderId": 42,
      "status": "SUCCESS"
    }
  }
  ```
- **Response (Duplicate transaction - 200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Payment already processed"
    }
  }
  ```

---

## 6. Cart Routes (`/cart`)

All cart routes require authentication.

### Add to Cart

Adds a product to the authenticated user's cart. Prevents duplicate entries — the same product cannot be added twice.

- **URL**: `/cart`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "productId": 1
  }
  ```
- **Response (Success - 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Product added to cart",
    "data": {
      "id": 5,
      "user_id": 1,
      "product_id": 1,
      "created_at": "2026-06-20T12:00:00.000Z"
    }
  }
  ```
- **Response (Already in cart - 409 Conflict)**:
  ```json
  {
    "success": false,
    "message": "Product is already in your cart",
    "data": {
      "id": 5,
      "user_id": 1,
      "product_id": 1,
      "created_at": "2026-06-20T12:00:00.000Z"
    }
  }
  ```
- **Response (Error - 400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "productId is required and must be a number"
  }
  ```

### Check if Product is in Cart

Checks whether a specific product exists in the authenticated user's cart.

- **URL**: `/cart/check/:productId`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Headers**:
  - `Authorization: Bearer <token>`
- **URL Params**: `productId` (Product ID, e.g. `/cart/check/1`)
- **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "inCart": true
    }
  }
  ```

### Get All Cart Items

Retrieves all products in the authenticated user's cart.

- **URL**: `/cart`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 5,
        "user_id": 1,
        "product_id": 1,
        "created_at": "2026-06-20T12:00:00.000Z"
      }
    ]
  }
  ```

---

## Error Responses

All protected endpoints share these common error responses:

### 401 Unauthorized

Returned when no token is provided or the token is invalid/expired.

```json
{
  "success": false,
  "message": "Authorization token required"
}
```

### 403 Forbidden

Returned when the user's role does not have permission.

```json
{
  "success": false,
  "message": "Forbidden: You do not have permission to access this resource"
}
```

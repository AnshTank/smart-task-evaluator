# API Documentation

## Authentication

All API endpoints require authentication via Supabase Auth. Include the user's JWT token in the Authorization header.

## Endpoints

### POST /api/evaluate

Evaluates a coding task using AI.

**Request Body:**
```json
{
  "taskId": "uuid",
  "title": "string",
  "description": "string",
  "code": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "evaluationId": "uuid"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

### POST /api/payment/create-intent

Creates a Stripe payment intent for unlocking full reports.

**Request Body:**
```json
{
  "evaluationId": "uuid"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

## Database Schema

### profiles
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `full_name` (Text, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### tasks
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `title` (Text)
- `description` (Text)
- `code` (Text, Nullable)
- `status` (Enum: pending, evaluating, completed, failed)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### evaluations
- `id` (UUID, Primary Key)
- `task_id` (UUID, Foreign Key)
- `score` (Integer, 0-100)
- `strengths` (Text Array)
- `weaknesses` (Text Array)
- `improvements` (Text Array)
- `full_report` (Text, Nullable)
- `is_paid` (Boolean)
- `created_at` (Timestamp)

### payments
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `evaluation_id` (UUID, Foreign Key)
- `stripe_payment_id` (Text)
- `amount` (Integer, in cents)
- `status` (Enum: pending, completed, failed)
- `created_at` (Timestamp)

## Row Level Security (RLS)

All tables have RLS policies ensuring:
- Users can only access their own data
- Service role can perform necessary operations
- Proper authorization checks on all operations
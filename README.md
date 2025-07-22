# HMCTS Developer Challenge

A RESTful case management API built with Express.js for HMCTS (Her Majesty's Courts and Tribunals Service). This project provides a simple, scalable foundation for managing court cases with full CRUD operations.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **UUID** - Unique identifier generation
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd hmcts-developer-challenge

# Install dependencies
npm install
```

### Running the Application
```bash
# Start the server
npm start

# Development mode with auto-restart
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Get All Cases
```http
GET /cases
```
Returns an array of all cases in the system.

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Smith v. Johnson",
    "description": "Contract breach case",
    "status": "open",
    "priority": "high",
    "assignedTo": "judge.brown@hmcts.gov.uk",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Case by ID
```http
GET /cases/:id
```
Returns a specific case by its ID.

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Smith v. Johnson",
  "description": "Contract breach case",
  "status": "open",
  "priority": "high",
  "assignedTo": "judge.brown@hmcts.gov.uk",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Create New Case
```http
POST /cases
```
Creates a new case. Requires `title` and `description` fields.

**Request Body:**
```json
{
  "title": "Jones v. Smith",
  "description": "Medical malpractice case",
  "status": "open",
  "priority": "high",
  "assignedTo": "judge.wilson@hmcts.gov.uk"
}
```

**Response:** `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Jones v. Smith",
  "description": "Medical malpractice case",
  "status": "open",
  "priority": "high",
  "assignedTo": "judge.wilson@hmcts.gov.uk",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Update Case
```http
PUT /cases/:id
```
Updates an existing case. Only provided fields will be updated.

**Request Body:**
```json
{
  "status": "in-progress",
  "priority": "medium"
}
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Smith v. Johnson",
  "description": "Contract breach case",
  "status": "in-progress",
  "priority": "medium",
  "assignedTo": "judge.brown@hmcts.gov.uk",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:45:00.000Z"
}
```

### Delete Case
```http
DELETE /cases/:id
```
Removes a case from the system.

**Response:** `204 No Content`

## Testing

The project includes comprehensive unit tests using Jest and Supertest.

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage
Tests cover all API endpoints including:
- Case creation with validation
- Case retrieval (single and multiple)
- Case updates
- Case deletion
- Error handling (404, 400 responses)
- Health check endpoint

## Data Storage

**Important:** This API uses in-memory storage. All data is stored in a JavaScript array and will be lost when the server restarts.

### Data Reset
- Data is automatically reset between test runs
- Each test starts with a clean state
- No persistent storage is implemented

### Data Structure
```typescript
interface Case {
  id: string;           // UUID v4
  title: string;        // Required
  description: string;  // Required
  status: string;       // Default: "open"
  priority: string;     // Default: "medium"
  assignedTo: string | null;  // Default: null
  createdAt: string;    // ISO 8601 timestamp
  updatedAt: string;    // ISO 8601 timestamp
}
```

## Error Responses

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (Delete) |
| 400 | Bad Request (Missing required fields) |
| 404 | Not Found (Case not found) |

## Development Notes

- CORS is enabled for all origins
- All timestamps are in ISO 8601 format
- UUID v4 is used for case IDs
- The server runs on port 3001 by default
- Health check endpoint available at `/health` 
# Lost and Found System Documentation

## Project Structure
```
pbl-web/
├── be-pbl/          # Backend (Laravel)
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── ItemController.php
│   │   │   └── ReportController.php
│   │   └── Models/
│   │       ├── Item.php
│   │       └── Report.php
│   └── routes/
│       └── api.php
└── fe-pbl/          # Frontend (React)
    ├── src/
    │   ├── components/
    │   │   ├── Admin/
    │   │   │   ├── Dashboard.jsx
    │   │   │   └── Review.jsx
    │   │   └── Form/
    │   │       ├── ClaimForm.jsx
    │   │       └── FormuliBarangDitemukan.jsx
    └── package.json
```

## Backend (Laravel)

### Setup Requirements
- PHP >= 8.1
- Composer
- MySQL
- Laravel 9.x

### Installation
```bash
cd be-pbl
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### API Endpoints

#### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `GET /api/items/{id}` - Get item details
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item

#### Reports
- `POST /api/reports` - Create new report
- `GET /api/reports` - Get all reports
- `PUT /api/reports/{id}` - Update report status

### Models

#### Item
- title: string
- description: string
- location: string
- category: string
- date: date
- status: string (pending/verified/rejected)
- type: string (lost/found)
- image: array
- user_id: integer

#### Report
- item_id: integer
- userName: string
- contact: string
- message: string
- proofDescription: string
- proofImages: array
- report_type: string (claim/found)
- status: string
- admin_review: boolean

## Frontend (React)

### Setup Requirements
- Node.js >= 16
- npm/yarn

### Installation
```bash
cd fe-pbl
npm install
npm run dev
```

### Key Components

#### Admin Dashboard
- Path: `/admin/dashboard`
- Features:
  - Overview statistics
  - Items management
  - Reports review
  - Status updates

#### Review System
- Features:
  - View item details
  - Review reports
  - Verify/Reject claims
  - WhatsApp integration for notifications

#### Forms
1. Found Item Form
   - Report found items
   - Upload multiple images
   - Location details
   - Item description

2. Claim Form
   - Submit item claims
   - Proof upload
   - Contact information
   - Item verification

### Environment Variables
```env
VITE_API_URL=https://lostandfound-be.raffifadlika.com/api
```

## API Integration
The frontend communicates with the backend through RESTful API endpoints using fetch API. All API calls are configured to handle:
- Authentication
- File uploads
- Error handling
- Success responses

## Development Guide
1. Backend modifications:
   - Follow Laravel conventions
   - Update migrations for database changes
   - Add new controllers in `app/Http/Controllers/Api`

2. Frontend modifications:
   - Use component-based architecture
   - Follow React best practices
   - Handle API responses appropriately
   - Maintain consistent UI/UX

## Security Features
- CORS protection
- Input validation
- File upload restrictions
- Status verification system

## Deployment
The system is deployed using:
- Backend: Laravel on PHP server
- Frontend: React with Vite build system
- Database: MySQL
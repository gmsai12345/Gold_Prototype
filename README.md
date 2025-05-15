# Gold Loan Management System

## 📖 Overview
This is a comprehensive gold loan management platform built with React, TypeScript, and Node.js. The system facilitates gold-based loan applications, user registration, and administrative approval processes. This documentation provides detailed insights into the project structure, component architecture, and integration workflows.

## 🌟 Key Features

### User Authentication
- **Google OAuth Integration**: Secure authentication using Firebase
- **Session Management**: Persistent user sessions with secure token handling
- **Role-based Access**: Distinct user and admin access levels

### User Registration System
- **Multi-step Form Process**: Five comprehensive registration stages
- **Data Validation**: Real-time form validation using Yup schema
- **Progress Persistence**: Automatic save and resume functionality

### Gold Loan Processing
- **Valuation System**: Real-time gold value assessment
- **Loan Calculator**: Dynamic EMI and interest calculations
- **Application Tracking**: Status monitoring and updates

### Administrative Controls
- **Application Review**: Comprehensive approval workflow
- **User Management**: Complete user profile administration
- **System Monitoring**: Activity logs and audit trails

## 🏗️ Project Architecture

### Frontend Structure (/src)
```
src/
├── api/                    # API Integration Layer
│   ├── loanApi.ts          # Loan operations API
│   │   ├── submitLoan()    # Submit new loan application
│   │   ├── getLoanStatus() # Check loan status
│   │   └── updateLoan()    # Update loan details
│   └── userApi.ts          # User management API
│       ├── register()      # User registration
│       ├── updateProfile() # Profile updates
│       └── getUser()       # User data retrieval
├── components/             # Reusable Components
│   ├── Loading.tsx         # Loading indicator
│   │   ├── Props: size, color, text
│   │   └── Usage: Global loading states
│   └── ProtectedRoute.tsx  # Route protection
│       ├── Props: role, redirectPath
│       └── Usage: Access control
├── context/
│   └── AuthContext.tsx     # Authentication Context
│       ├── State: user, loading, error
│       └── Methods: login(), logout(), updateUser()
├── firebase/
│   └── config.ts           # Firebase Configuration
│       ├── Authentication setup
│       └── Real-time database config
└── pages/                  # Application Pages
    ├── admin/              # Admin Section
    │   ├── Dashboard.tsx   # Admin overview
    │   └── Approvals.tsx   # Application review
    ├── user/               # User Section
    │   ├── Profile.tsx     # User profile
    │   └── Loans.tsx       # Loan management
    ├── Login.tsx           # Authentication
    └── UserRegistration.tsx # Registration flow
```

### Backend Structure (/server)
```
server/
├── models/                 # Database Schemas
│   ├── loanModel.js        # Loan data structure
│   │   ├── Fields: amount, status, userId
│   │   └── Methods: calculate(), validate()
│   └── userModel.js        # User data structure
│       ├── Fields: profile, auth, loans
│       └── Methods: verify(), update()
└── routes/                 # API Endpoints
    ├── goldRoutes.js       # Gold valuation
    ├── loanRoutes.js       # Loan processing
    └── userRoutes.js       # User management
```

## 🔄 Component Integration

### Authentication Flow
1. **User Login**
   - Firebase authentication trigger
   - JWT token generation
   - Context state update
   - Route redirection

2. **Session Management**
   - Token persistence in localStorage
   - Automatic session renewal
   - Secure token validation

### Registration Process
1. **Form Progression**
   ```typescript
   // UserRegistration.tsx
   const steps = [
     'personal',   // Name, DOB, etc.
     'contact',    // Address, phone
     'identity',   // ID proofs
     'employment', // Job details
     'nominee'     // Beneficiary
   ];
   ```

2. **Data Handling**
   - Progressive form submission
   - Validation at each step
   - Temporary storage management

### Loan Application Flow
1. **Valuation Process**
   - Gold purity assessment
   - Current market rate fetch
   - Value calculation

2. **Application Processing**
   - Document verification
   - Risk assessment
   - Approval workflow

## 🛠️ Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Firebase account

### Installation Steps
1. **Clone Repository**
   ```bash
   git clone https://github.com/NeuralNinja110/Gold_Prototype.git
   cd project
   ```

2. **Install Dependencies**
   ```bash
   # Frontend
   npm install

   # Backend
   cd server
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_ADMIN_EMAIL=admin@example.com

   # Backend Environment Variables
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Development Servers**
   ```bash
   # Frontend (http://localhost:5173)
   npm run dev

   # Backend (http://localhost:5000)
   cd server
   npm run dev
   ```

## 🔒 Security Implementation

### Authentication Security
- OAuth2.0 protocol implementation (Firebase)
- Secure token management
- Rate limiting on auth endpoints

### Data Protection
- Input sanitization
- XSS prevention
- CORS configuration
- Request validation

### API Security
- JWT authentication
- Route protection
- Error handling
- Request rate limiting

## 📡 API Documentation

### User Endpoints
```typescript
// User Registration
POST /api/users/register
Body: {
  personal: PersonalInfo,
  contact: ContactInfo,
  identity: IdentityInfo,
  employment: EmploymentInfo,
  nominee: NomineeInfo
}

// User Profile
GET /api/users/profile
PUT /api/users/profile
Body: {
  userId: string,
  updates: ProfileUpdates
}
```

### Loan Endpoints
```typescript
// Loan Application
POST /api/loans/apply
Body: {
  userId: string,
  goldDetails: GoldInfo,
  loanAmount: number
}

// Loan Status
GET /api/loans/status/:loanId

// Loan Update
PUT /api/loans/:loanId
Body: {
  status: LoanStatus,
  remarks: string
}
```

## 🎨 UI/UX Guidelines

### Component Styling
- Tailwind CSS utility classes
- Responsive design patterns
- Accessibility compliance

### Theme Configuration
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#1a365d',
        secondary: '#718096',
        accent: '#f6ad55'
      }
    }
  }
}
```

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- API endpoint testing
- Model validation testing

### Integration Tests
- Authentication flow
- Form submission process
- Loan application workflow

## 📦 Deployment

### Build Process
```bash
# Frontend and Backend Run Command
npm i
npm run dev:all
```

### Production Configuration
- Environment variable management
- SSL/TLS setup
- Database optimization
- Caching implementation


### Code Style
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Component documentation

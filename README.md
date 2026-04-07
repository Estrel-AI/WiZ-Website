# WiiZ Customer Portal - OAuth Integration

Complete OAuth login system (Google, LinkedIn, GitHub) integrated with WiiZ backend API and Zoho Billing for the customer portal.

## Features

- ✅ OAuth login (Google, LinkedIn, GitHub)
- ✅ User authentication via WiiZ API
- ✅ Zoho Billing customer integration
- ✅ JWT token-based sessions
- ✅ Customer portal with pricing
- ✅ Payment gateway integration
- ✅ Hub auto-login with OAuth credentials

## Quick Start

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
Backend runs on: http://localhost:3001

### 2. Start Frontend Server
```bash
# From root directory
python -m http.server 3000 --bind 0.0.0.0
```
Frontend runs on: http://localhost:3000

### 3. Test OAuth Login
1. Go to http://localhost:3000/Login.html
2. Click "Continue with Google"
3. Complete authentication
4. Redirected to customer portal

## Project Structure

```
├── backend/
│   ├── config/
│   │   ├── database.js          # MySQL connection
│   │   └── passport.js          # OAuth strategies
│   ├── routes/
│   │   ├── auth.js              # OAuth routes
│   │   └── payments.js          # Payment webhooks
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── services/
│   │   └── zohoService.js       # Zoho API integration
│   ├── database/
│   │   └── schema.sql           # Database schema
│   ├── .env                     # Environment variables
│   ├── server.js                # Express server
│   └── package.json
│
├── assets/
│   ├── css/                     # Stylesheets
│   ├── js/
│   │   ├── main.js              # Main JavaScript
│   │   └── forms.js             # Form handlers
│   └── img/                     # Images
│
├── Login.html                   # Login page with OAuth
├── Signup.html                  # Signup page with OAuth
├── index.html                   # Customer portal home
├── pricing.html                 # Pricing and plans
├── contact.html                 # Contact page
├── services.html                # Services page
├── Faq.html                     # FAQ page
└── README.md                    # This file
```

## Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# Environment
NODE_ENV=sandbox
DEV_MODE=false

# WiiZ API
WIIZ_API_BASE=https://sandbox.wiiz.it/aiwf

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# JWT
JWT_SECRET=your-secret-key

# MySQL Database
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=wiiz_website
DB_PORT=3306

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_CLIENT_SECRET=your-client-secret
LINKEDIN_CALLBACK_URL=http://localhost:3001/auth/linkedin/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback
```

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE wiiz_website;
```

2. Import schema:
```bash
mysql -u root -p wiiz_website < backend/database/schema.sql
```

## OAuth Flow

```
User clicks "Continue with Google"
  ↓
Google authenticates user
  ↓
Backend receives user data
  ↓
Backend calls WiiZ signup API
  ↓
Backend calls WiiZ signin API (to get Zoho customer ID)
  ↓
Backend stores user in MySQL with Zoho ID
  ↓
Backend generates JWT token
  ↓
User redirected to customer portal
  ↓
User can browse pricing and purchase plans
```

## API Endpoints

### Backend Routes

#### OAuth Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/linkedin` - Initiate LinkedIn OAuth
- `GET /auth/linkedin/callback` - LinkedIn OAuth callback
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - GitHub OAuth callback

#### Authentication
- `GET /auth/verify` - Verify JWT token
- `POST /auth/logout` - Logout user

#### Payments
- `POST /payments/webhook/success` - Payment success webhook
- `POST /payments/create-checkout` - Create checkout URL
- `GET /payments/status/:email` - Check payment status

### WiiZ API Endpoints

#### User Management
- `POST /aiwf/signup` - Create new user
- `POST /aiwf/signin` - Login user (returns Zoho customer ID)
- `POST /aiwf/generate_otp` - Generate OTP for email verification

#### Subscription Management
- `POST /aiwf/update_execution_subscription` - Update subscription executions
- `POST /aiwf/update_execution_addons` - Update addon executions

## Payment Integration

### Checkout URL Format
```
https://payments.wiiz.it/payments/checkOut?
  zoho_customer_id=7816790000000516124&
  customer_name=John+Doe&
  customer_email=user@gmail.com&
  plan_code=WIIZ_STARTER_MONTHLY_TEST&
  redirect_url=https://hub.wiiz.it/aistudio/login
```

### Payment Webhook

After successful payment, the payment gateway calls:
```
POST /payments/webhook/success
{
  "zoho_customer_id": "7816790000000516124",
  "plan_code": "WIIZ_STARTER_MONTHLY_TEST",
  "payment_id": "PAY_123456789",
  "amount": 19.99
}
```

Backend then updates executions via WiiZ API.

## Troubleshooting

### OAuth Login Not Working
1. Check backend is running on port 3001
2. Verify OAuth credentials in `.env`
3. Check callback URLs match OAuth app settings
4. Clear browser localStorage and try again

### Payment "Customer Does Not Exist" Error
1. Check user has valid Zoho customer ID in database
2. Verify Zoho customer ID is not "pending_api_sync"
3. User needs to login again to get real Zoho ID

### WiiZ API Connection Issues
1. Check internet connection
2. Verify API endpoint is accessible
3. Try flushing DNS: `ipconfig /flushdns`
4. Contact WiiZ support if persistent

## Production Deployment

### Update Environment Variables
```env
NODE_ENV=production
WIIZ_API_BASE=https://sandbox.wiiz.it/aiwf
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
```

### Security Checklist
- [ ] Change JWT_SECRET to strong random value
- [ ] Enable HTTPS for all endpoints
- [ ] Update CORS settings for production domain
- [ ] Secure database with strong password
- [ ] Enable rate limiting on API endpoints
- [ ] Set up proper logging and monitoring

## Support

For issues or questions:
- Email: support.wiiz@estrel.ai
- Website: https://www.wiiz.it

## License

Copyright 2026 Estrel AI Ltd. All Rights Reserved.

# Smart Task Evaluator

A production-ready AI-powered SaaS platform for evaluating coding tasks and providing detailed feedback.

## 🚀 Features

- **User Authentication**: Secure signup/login with Supabase Auth
- **Task Submission**: Submit coding tasks with descriptions and code
- **AI Evaluation**: Get instant feedback using Google Gemini AI
- **Detailed Reports**: Comprehensive analysis with strengths, weaknesses, and improvements
- **Payment System**: Unlock full reports with Stripe integration
- **Dashboard**: Track all submissions and evaluations
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **AI Integration**: Google Gemini Pro
- **Payments**: Stripe
- **Deployment**: Vercel

## 📁 Project Structure

```
smart-task-evaluator/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/
│   │   ├── submit/
│   │   ├── evaluation/[id]/
│   │   ├── payment/[evaluationId]/
│   │   └── api/
│   │       ├── evaluate/
│   │       └── payment/
│   ├── components/
│   ├── lib/
│   └── types/
├── supabase/
├── docs/
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Gemini API key
- Stripe account

### Environment Variables

Create `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql`
   - Enable Row Level Security (RLS)

4. Configure authentication:
   - Enable email authentication in Supabase
   - Set up redirect URLs

5. Start development server:
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### Tables

- **profiles**: User profile information
- **tasks**: Submitted coding tasks
- **evaluations**: AI evaluation results
- **payments**: Payment records

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only access their own data.

## 🤖 AI Integration

The application uses Google's Gemini Pro model to evaluate coding tasks. The AI provides:

- Numerical score (0-100)
- Strengths analysis
- Weakness identification
- Improvement suggestions
- Detailed technical report

## 💳 Payment System

- **Free**: Basic evaluation with score and key points
- **Premium ($4.99)**: Full detailed report with comprehensive analysis
- Secure payment processing with Stripe
- Instant report unlocking after successful payment

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Input validation and sanitization
- Authentication required for all protected routes
- Secure API endpoints
- Environment variable protection

## 🚀 Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Database Migration

Run the Supabase schema to set up all required tables and policies.

## 📊 Features Checklist

### Frontend ✅
- [x] Login/Signup pages
- [x] Dashboard with task overview
- [x] Task submission form
- [x] AI evaluation results UI
- [x] Payment flow
- [x] Responsive design

### Backend ✅
- [x] Supabase authentication
- [x] Database tables with RLS
- [x] API routes for evaluation
- [x] Payment processing
- [x] Error handling

### AI Integration ✅
- [x] Google Gemini API integration
- [x] Task evaluation logic
- [x] Result parsing and storage
- [x] Error handling for AI failures

### Additional Features ✅
- [x] TypeScript implementation
- [x] Clean code structure
- [x] Environment configuration
- [x] Documentation

## 🐛 Known Issues (Intentional for AI Fixing)

The following components contain intentional bugs for AI tools to identify and fix:

1. **BrokenTaskCard.tsx**: Component with multiple React and TypeScript issues
2. **buggy-utils.ts**: Utility functions with performance and security problems
3. **broken-endpoint/route.ts**: API endpoint with security vulnerabilities

## 🔧 Development Tools Used

- **AI Tools**: Used for code generation, debugging, and optimization
- **Manual Edits**: Configuration files, environment setup, and final testing

## 📝 License

This project is for educational purposes as part of a coding assignment.

## 🤝 Contributing

This is an assignment project. Please refer to the assignment requirements for evaluation criteria.

---

**Assignment Completion**: This project fulfills all requirements including frontend, backend, AI integration, payment system, and intentional bugs for AI fixing.
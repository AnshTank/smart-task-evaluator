# Smart Task Evaluator - Complete Website Documentation

## 🌟 Overview

Smart Task Evaluator is a modern web application built with Next.js 14 that allows users to submit programming tasks and receive AI-powered evaluations. The platform features a comprehensive authentication system, subscription-based plans, and a responsive design with full dark mode support.

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **AI Integration**: Google Gemini API

### Key Features
- ✅ User Authentication (Sign up/Sign in)
- ✅ Task Submission & AI Evaluation
- ✅ Subscription Plans (Free, Premium, Ultra Premium)
- ✅ Dashboard with Statistics
- ✅ Dark/Light Mode Toggle
- ✅ Mobile Responsive Design
- ✅ Auto-logout Security (10-minute timeout)
- ✅ Custom Scrollbar Design
- ✅ Profile Management

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── evaluation/        # Task evaluation results
│   ├── notifications/     # User notifications
│   ├── payment/          # Payment processing
│   ├── plans/            # Subscription plans
│   ├── settings/         # User settings
│   ├── submit/           # Task submission
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable components
│   ├── EnhancedNavbar.tsx
│   ├── EnhancedDashboard.tsx
│   ├── ThemeToggle.tsx
│   └── ProfileDropdown.tsx
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utilities
│   └── supabase.ts       # Supabase client
└── types/               # TypeScript types
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#3b82f6 to #2563eb)
- **Secondary**: Purple gradient (#8b5cf6 to #7c3aed)
- **Accent**: Pink (#ec4899)
- **Background Light**: White (#ffffff)
- **Background Dark**: Gray-900 (#111827)

### Typography
- **Font**: System fonts (Inter fallback)
- **Responsive**: `text-responsive` utility class
- **Hierarchy**: Clear heading structure with proper contrast

### Spacing & Layout
- **Container**: Max-width 7xl with responsive padding
- **Grid**: Responsive grid system (1-4 columns)
- **Margins**: Responsive margin utilities

## 🌙 Dark Mode Implementation

### Configuration
```typescript
// tailwind.config.ts
darkMode: 'class'  // Enables class-based dark mode
```

### Theme Toggle Component
```typescript
// ThemeToggle.tsx
- Detects system preference
- Persists choice in localStorage
- Animated slider with sun/moon icons
- Twinkling stars animation in dark mode
```

### Implementation Strategy
1. **Global Base Styles**: Applied to all elements via `@layer base`
2. **Component-Level**: Each component has `dark:` prefixed classes
3. **Automatic Detection**: Respects system preference on first visit
4. **Persistence**: Saves user choice in localStorage

### Dark Mode Classes Applied
- **Backgrounds**: `dark:bg-gray-800`, `dark:bg-gray-900`
- **Text**: `dark:text-gray-100`, `dark:text-gray-300`
- **Borders**: `dark:border-gray-700`
- **Interactive**: `dark:hover:bg-gray-700`

## 📱 Mobile Responsiveness

### Breakpoints
- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up

### Mobile Features
- **Hamburger Menu**: Collapsible navigation
- **Touch-Friendly**: Larger tap targets
- **Responsive Text**: `text-responsive` utility
- **Smart Pagination**: Adaptive page numbers
- **Optimized Layouts**: Stack on mobile, grid on desktop

### Responsive Components
```typescript
// Navbar: Hamburger menu for mobile
// Dashboard: Responsive cards and pagination
// Forms: Stack inputs on mobile
// Tables: Horizontal scroll on mobile
```

## 🔐 Authentication System

### Features
- **Sign Up/Sign In**: Email-based authentication
- **Auto-logout**: 10-minute inactivity timeout
- **Activity Tracking**: Mouse, keyboard, scroll events
- **Page Visibility**: Pauses timer when tab inactive
- **Secure Routes**: Protected pages with auth guards

### Implementation
```typescript
// AuthContext.tsx
- Manages user state
- Handles login/logout
- Activity monitoring
- Automatic session cleanup
```

### Security Measures
- **Inactivity Timeout**: 10 minutes
- **Activity Detection**: Multiple event types
- **Secure Storage**: Supabase session management
- **Route Protection**: Middleware-based guards

## 💳 Subscription System

### Plans
1. **Free Plan**
   - 3 evaluations per month
   - Basic features

2. **Premium Plan** - $4.99/report
   - Pay-per-evaluation
   - Advanced features

3. **Ultra Premium** - $19.99/month
   - Unlimited evaluations
   - Priority support
   - Advanced analytics

### Payment Flow
```
User selects plan → Payment page → Stripe integration → Database update → Redirect to dashboard
```

## 🎯 Custom Features

### Custom Scrollbar
```css
/* 4px width with gradient colors */
::-webkit-scrollbar {
  width: 4px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
}
```

### Activity Tracking
- **Mouse Movement**: Tracks cursor activity
- **Keyboard Input**: Detects typing
- **Scroll Events**: Monitors page scrolling
- **Page Visibility**: Handles tab switching

### Smart Pagination
- **Adaptive**: Shows relevant page numbers
- **Mobile Optimized**: Fewer pages on small screens
- **Ellipsis**: Indicates hidden pages

## 🚀 Performance Optimizations

### Next.js Features
- **App Router**: Latest routing system
- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic bundle splitting

### CSS Optimizations
- **Tailwind Purging**: Removes unused CSS
- **Custom Utilities**: Reusable responsive classes
- **Minimal Custom CSS**: Leverages Tailwind utilities

### Loading States
- **Skeleton Screens**: Smooth loading experience
- **Progressive Enhancement**: Works without JavaScript
- **Optimistic Updates**: Immediate UI feedback

## 🔧 Configuration Files

### Next.js Config
```javascript
// next.config.js
- Removed deprecated appDir option
- Optimized for production builds
```

### Tailwind Config
```typescript
// tailwind.config.ts
- Dark mode: 'class'
- Custom color palette
- Responsive breakpoints
- Content paths for purging
```

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_key
```

## 📊 Database Schema

### Tables
- **profiles**: User information and subscription plans
- **evaluations**: Task submissions and AI evaluations
- **tasks**: Submitted programming tasks

### Key Relationships
```sql
profiles (1) → (many) evaluations
profiles (1) → (many) tasks
```

## 🎨 UI/UX Design Principles

### Visual Hierarchy
- **Clear Navigation**: Prominent logo and menu items
- **Action-Oriented**: CTA buttons stand out
- **Content Focus**: Clean, distraction-free layouts

### Accessibility
- **Color Contrast**: WCAG compliant ratios
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML structure
- **Focus Indicators**: Clear focus states

### User Experience
- **Consistent**: Uniform design patterns
- **Intuitive**: Familiar interaction patterns
- **Responsive**: Works on all devices
- **Fast**: Optimized loading times

## 🔄 State Management

### Context Providers
```typescript
// AuthContext: User authentication state
// ThemeContext: Implicit via localStorage and DOM classes
```

### Data Flow
1. **User Actions**: Trigger state updates
2. **Context Updates**: Propagate to components
3. **UI Updates**: React re-renders affected components
4. **Persistence**: Save to localStorage/database

## 🧪 Development Workflow

### Getting Started
```bash
npm install
npm run dev
```

### Build Process
```bash
npm run build
npm start
```

### Key Commands
- `npm run dev`: Development server
- `npm run build`: Production build
- `npm run lint`: Code linting
- `npm run type-check`: TypeScript checking

## 🚀 Deployment

### Vercel Deployment
- **Automatic**: Connected to Git repository
- **Environment Variables**: Configured in Vercel dashboard
- **Domain**: Custom domain setup
- **SSL**: Automatic HTTPS

### Database Setup
- **Supabase**: Hosted PostgreSQL
- **Migrations**: SQL files in `/supabase` folder
- **RLS**: Row Level Security enabled

## 📈 Analytics & Monitoring

### User Metrics
- **Task Submissions**: Track evaluation requests
- **Plan Usage**: Monitor subscription utilization
- **User Activity**: Dashboard engagement metrics

### Performance Monitoring
- **Core Web Vitals**: Loading, interactivity, visual stability
- **Error Tracking**: Client and server-side errors
- **User Experience**: Navigation patterns

## 🔮 Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket integration
- **Advanced Analytics**: Detailed performance metrics
- **Team Collaboration**: Multi-user workspaces
- **API Access**: Developer API endpoints

### Technical Improvements
- **PWA Support**: Offline functionality
- **Advanced Caching**: Redis integration
- **Microservices**: Service-oriented architecture
- **GraphQL**: Advanced data fetching

## 📝 Conclusion

The Smart Task Evaluator represents a modern, full-stack web application with enterprise-grade features including authentication, payments, responsive design, and comprehensive dark mode support. The codebase follows best practices for maintainability, performance, and user experience.

The implementation demonstrates proficiency in:
- Modern React/Next.js development
- TypeScript for type safety
- Tailwind CSS for responsive design
- Supabase for backend services
- AI integration with Google Gemini
- Security best practices
- Mobile-first design principles

---

*Documentation last updated: $(date)*
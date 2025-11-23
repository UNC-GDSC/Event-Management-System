# EventHub - Professional Event Management System

A cutting-edge, production-ready event management platform built with React, TypeScript, and Firebase. Create, manage, and attend events with powerful features including real-time updates, comprehensive analytics, social sharing, and much more.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Firebase](https://img.shields.io/badge/Firebase-Platform-orange)

## ✨ Highlights

- 🎯 **Production-Ready**: Fully tested, optimized build with comprehensive error handling
- 🔄 **Real-time Everything**: Live updates for events, RSVPs, comments, and announcements
- 🌓 **Dark Mode**: Beautiful dark theme with smooth transitions
- 📱 **PWA Support**: Install as a mobile app with offline capabilities
- 📊 **Advanced Analytics**: Admin dashboard with charts and statistics
- 🔒 **Secure**: Complete Firebase security rules and role-based access control
- ♿ **Accessible**: WCAG compliant with keyboard navigation support

## 🚀 Core Features

### Authentication & User Management
- ✅ Email/Password authentication
- ✅ Google OAuth integration
- ✅ Protected routes with role-based access (User/Admin)
- ✅ User profile management
- ✅ Persistent sessions

### Event Management
- ✅ Full CRUD operations for events
- ✅ Rich event details (title, description, dates, location, capacity)
- ✅ High-quality image uploads (Firebase Storage)
- ✅ Event categorization (10+ categories)
- ✅ Flexible tagging system
- ✅ Real-time event status (upcoming, ongoing, completed)
- ✅ Event editing with version control
- ✅ Bulk operations for admins

### RSVP System
- ✅ Real-time RSVP tracking with Firestore
- ✅ Multiple response options (Going, Maybe, Not Going)
- ✅ Guest count management
- ✅ Live attendee count updates
- ✅ Attendee list with contact information
- ✅ Export attendees to CSV
- ✅ RSVP status changes with notifications

### Comments & Discussion
- ✅ Real-time comment system for events
- ✅ Threaded discussions
- ✅ User avatars and timestamps
- ✅ Delete own comments
- ✅ Admin moderation capabilities

### Announcements
- ✅ Create and manage announcements
- ✅ Priority levels (Low, Medium, High)
- ✅ Real-time updates across all users
- ✅ Event-specific or general announcements
- ✅ Rich text formatting

### Social Features
- ✅ **Event Sharing**: Share to Facebook, Twitter, LinkedIn, WhatsApp
- ✅ **QR Code Generation**: Generate and download QR codes for easy check-in
- ✅ **Favorites/Bookmarks**: Save events for later
- ✅ **Social Proof**: See who else is attending

### Admin Dashboard
- ✅ Comprehensive analytics and statistics
- ✅ Interactive charts (Pie, Bar, Line charts)
- ✅ User management overview
- ✅ Event performance metrics
- ✅ RSVP analytics
- ✅ System health monitoring

### User Experience
- ✅ **Dark Mode**: Toggle between light and dark themes
- ✅ **Skeleton Loaders**: Smooth loading experiences
- ✅ **Toast Notifications**: Real-time feedback
- ✅ **Error Boundaries**: Graceful error handling
- ✅ **404 Page**: Custom not found page
- ✅ **Mobile Responsive**: Perfect on all devices
- ✅ **Keyboard Navigation**: Full accessibility support

### Export & Integration
- ✅ Export attendee lists to CSV
- ✅ QR code check-in system
- ✅ Social media integration
- ✅ Calendar integration ready
- ✅ Email notifications ready

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest version with concurrent features
- **TypeScript** - 100% type-safe codebase
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS with dark mode
- **React Router v6** - Modern routing
- **Recharts** - Beautiful, responsive charts
- **React Icons** - Comprehensive icon library
- **React Toastify** - Elegant notifications
- **date-fns** - Modern date utility library
- **React Share** - Social sharing components
- **QRCode.react** - QR code generation
- **PapaParse** - CSV parsing and generation
- **html-to-image** - Export to images

### Backend & Services
- **Firebase Authentication** - Secure user management
- **Cloud Firestore** - Real-time NoSQL database
- **Firebase Storage** - Scalable file storage
- **Firebase Security Rules** - Data protection
- **Firestore Indexes** - Optimized queries

### Development & Build
- **ESLint** - Code quality
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility

## 📦 Project Structure

```
Event-Management-System/
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   └── icons/             # App icons
├── src/
│   ├── components/
│   │   ├── announcements/  # Announcement components
│   │   │   ├── AnnouncementCard.tsx
│   │   │   └── AnnouncementForm.tsx
│   │   ├── common/         # Shared components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── DarkModeToggle.tsx
│   │   │   └── SkeletonLoader.tsx
│   │   ├── events/         # Event components
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventForm.tsx
│   │   │   ├── RSVPSection.tsx
│   │   │   ├── Comments.tsx
│   │   │   ├── AttendeesList.tsx
│   │   │   ├── FavoriteButton.tsx
│   │   │   ├── ShareEvent.tsx
│   │   │   ├── QRCodeModal.tsx
│   │   │   └── ExportAttendees.tsx
│   │   └── layout/         # Layout components
│   │       └── Navbar.tsx
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/             # Custom hooks
│   │   ├── useEvents.ts
│   │   ├── useRSVPs.ts
│   │   └── useAnnouncements.ts
│   ├── pages/             # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Events.tsx
│   │   ├── EventDetails.tsx
│   │   ├── EditEvent.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Announcements.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── NotFound.tsx
│   ├── services/          # Firebase services
│   │   ├── authService.ts
│   │   ├── eventService.ts
│   │   ├── rsvpService.ts
│   │   ├── announcementService.ts
│   │   ├── commentService.ts
│   │   └── favoriteService.ts
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── dateUtils.ts
│   │   └── validation.ts
│   └── config/            # Configuration
│       └── firebase.ts
├── firestore.rules        # Security rules
├── firestore.indexes.json # Database indexes
├── storage.rules          # Storage security rules
├── firebase.json          # Firebase config
└── tailwind.config.js     # Tailwind configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Event-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**

   Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

   Enable these services:
   - **Authentication**: Email/Password + Google
   - **Firestore Database**: Start in production mode
   - **Storage**: Default settings

4. **Configure environment**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Add your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Deploy Firebase rules**
   ```bash
   firebase deploy --only firestore:rules,storage
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

## 🏗️ Build for Production

```bash
npm run build
```

Build output will be in `dist/` directory.

## 📚 Usage Guide

### For End Users

1. **Sign Up/Login**
   - Create account with email or Google
   - Secure authentication with Firebase

2. **Browse Events**
   - View all events with search and filters
   - See event details, location, and capacity
   - Check real-time RSVP counts

3. **RSVP to Events**
   - Choose: Going, Maybe, or Not Going
   - Specify number of guests
   - View other attendees

4. **Engage with Events**
   - Add comments and discussions
   - Favorite events for later
   - Share on social media
   - Download QR codes

5. **Manage Your Events**
   - Create events with rich details
   - Upload event images
   - Edit and update events
   - Track RSVPs and attendance
   - Export attendee lists

### For Administrators

Set first user as admin in Firestore:
1. Go to Firebase Console → Firestore
2. Open `users` collection
3. Find your user document
4. Set `role` field to `"admin"`

Admin capabilities:
- Access admin dashboard at `/admin`
- View system-wide analytics
- Manage all events and users
- Monitor RSVP trends
- Export data and reports
- Moderate comments
- View detailed statistics

## 🎨 Features in Detail

### Dark Mode
Toggle between light and dark themes. Preference is saved to localStorage and persists across sessions.

### Real-time Updates
All data syncs in real-time using Firestore listeners:
- Event changes
- New RSVPs
- Comments
- Announcements

### Social Sharing
Share events on:
- Facebook
- Twitter
- LinkedIn
- WhatsApp
- Copy link to clipboard

### QR Code Check-in
- Generate unique QR codes for each event
- Download as PNG
- Scan to view event details
- Perfect for event check-in

### Export Features
- Export attendee lists to CSV
- Includes name, email, RSVP status, guest count
- Perfect for event planning

### Analytics Dashboard
Visualize your data:
- Event distribution by category
- Status breakdown (upcoming/ongoing/completed)
- User growth metrics
- RSVP trends
- Recent activity

## 🔒 Security

- Firebase Security Rules for Firestore and Storage
- Role-based access control (RBAC)
- Input validation and sanitization
- Protected routes
- Secure file uploads (5MB limit, image types only)
- XSS protection
- CSRF protection

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📱 PWA Features

- Install on home screen
- Offline capabilities
- App-like experience
- Push notifications (ready)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Tailwind CSS for styling
- React community
- All open-source contributors

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review FAQ section

## 🗺️ Roadmap

- [ ] Email notifications
- [ ] Calendar integration
- [ ] Recurring events
- [ ] Event templates
- [ ] Multi-language support
- [ ] Advanced search with Algolia
- [ ] Video streaming integration
- [ ] Payment integration
- [ ] Ticket sales
- [ ] Event analytics export

---

**Built with ❤️ using React, TypeScript, Firebase, and Tailwind CSS**

**Version**: 2.0.0  
**Last Updated**: November 2025

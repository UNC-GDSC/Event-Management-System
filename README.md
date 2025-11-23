# EventHub - Event Management System

A modern, full-featured event management system built with React, TypeScript, and Firebase. Manage events, track RSVPs, and keep attendees informed with real-time announcements.

## Features

### Core Features
- **User Authentication**
  - Email/Password authentication
  - Google OAuth integration
  - Protected routes and role-based access

- **Event Management**
  - Create, read, update, and delete events
  - Rich event details (title, description, dates, location, capacity)
  - Image uploads for events
  - Event categorization and tagging
  - Real-time event status (upcoming, ongoing, completed)

- **RSVP System**
  - Real-time RSVP tracking
  - Multiple response options (Going, Maybe, Not Going)
  - Guest count tracking
  - Live attendee count updates

- **Announcements**
  - Create and manage announcements
  - Priority levels (Low, Medium, High)
  - Real-time updates
  - Event-specific or general announcements

- **User Dashboard**
  - View all created events
  - Track event statistics
  - Quick event creation
  - Manage your events

### Technical Features
- **Real-time Updates**: Firestore real-time listeners for live data
- **Responsive Design**: Mobile-first, fully responsive UI
- **Image Upload**: Firebase Storage integration
- **Search & Filter**: Advanced event filtering and search
- **Loading States**: Comprehensive loading and error handling
- **Toast Notifications**: User-friendly feedback system
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Tailwind CSS with custom components

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Storage
- **Routing**: React Router v6
- **Icons**: React Icons
- **Notifications**: React Toastify
- **Date Handling**: date-fns

## Project Structure

```
src/
├── components/
│   ├── announcements/    # Announcement components
│   ├── auth/            # Authentication components
│   ├── common/          # Reusable components (Loading, ErrorMessage, etc.)
│   ├── dashboard/       # Dashboard components
│   ├── events/          # Event-related components
│   └── layout/          # Layout components (Navbar)
├── contexts/            # React contexts (AuthContext)
├── hooks/               # Custom hooks
├── pages/               # Page components
├── services/            # Firebase service functions
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── config/              # Configuration files

```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Event-Management-System
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Enable the following services:
   - **Authentication**:
     - Enable Email/Password provider
     - Enable Google provider
   - **Firestore Database**: Create database in production mode
   - **Storage**: Enable Firebase Storage

3. Get your Firebase configuration:
   - Go to Project Settings
   - Scroll to "Your apps" section
   - Click the web icon (</>)
   - Copy the configuration

4. Create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Firebase Security Rules

Deploy the Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

Deploy the Storage security rules:
```bash
firebase deploy --only storage
```

Or deploy both at once:
```bash
firebase deploy --only firestore:rules,storage
```

### 5. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase Hosting:
```bash
firebase init hosting
```

4. Build and deploy:
```bash
npm run build
firebase deploy --only hosting
```

### Deploy to Other Platforms

The built files in the `dist` directory can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## Usage Guide

### For Users

1. **Sign Up/Login**
   - Create an account using email/password or Google
   - Access protected features after authentication

2. **Browse Events**
   - View all events on the Events page
   - Use search and filters to find specific events
   - Click on an event to view full details

3. **RSVP to Events**
   - Click on an event
   - Select your RSVP status (Going, Maybe, Not Going)
   - View attendee counts in real-time

4. **Create Events**
   - Go to Dashboard
   - Click "Create New Event"
   - Fill in event details
   - Upload an event image (optional)
   - Add tags for better discoverability

5. **Manage Your Events**
   - View all your events in Dashboard
   - Edit event details
   - Delete events
   - Track RSVPs

6. **View Announcements**
   - Check the Announcements page for updates
   - Create announcements for your events

### For Administrators

First user needs to be manually set as admin in Firestore:

1. Go to Firebase Console > Firestore Database
2. Find the user document in the `users` collection
3. Update the `role` field to `"admin"`

Admins have additional privileges:
- Edit/delete any event
- Edit/delete any announcement
- Manage user data

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

## Security

- Firebase Security Rules are implemented for both Firestore and Storage
- Authentication required for protected routes
- Role-based access control (user/admin)
- Input validation on both client and server side
- Secure image uploads with size and type restrictions

## Features Roadmap

- [ ] Calendar view for events
- [ ] Email notifications for RSVPs
- [ ] Event search by date range
- [ ] Export attendee lists
- [ ] Recurring events
- [ ] Event comments/discussions
- [ ] Social sharing
- [ ] QR code check-in
- [ ] Event analytics dashboard
- [ ] Multiple image uploads per event

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- Built with React and Firebase
- UI designed with Tailwind CSS
- Icons from React Icons
- Date handling with date-fns

---

Built with ❤️ using React, TypeScript, and Firebase

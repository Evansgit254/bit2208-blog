# Architecture Overview

## System Architecture

BIT2208 Blog is built with an offline-first architecture that prioritizes local data storage and synchronization.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
├─────────────────────────────────────────────────────────────┤
│  React Components                                            │
│  ├── Pages (Home, NewPost, EditPost, PostView)             │
│  ├── Components (Header, Footer, MarkdownEditor, etc.)     │
│  └── Contexts (AuthContext)                                 │
├─────────────────────────────────────────────────────────────┤
│  Services Layer                                              │
│  ├── SQLite Adapter (sql.js + localStorage)                │
│  ├── Firebase Adapter (Firestore + Storage)                │
│  ├── Sync Service (Two-way synchronization)                │
│  └── Auth Service (Firebase Authentication)                │
├─────────────────────────────────────────────────────────────┤
│  Local Storage                                               │
│  └── IndexedDB/localStorage (SQLite database)              │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Firebase Backend                        │
├─────────────────────────────────────────────────────────────┤
│  Firebase Authentication                                     │
│  Firebase Firestore (Cloud Database)                        │
│  Firebase Storage (Image Storage)                           │
│  Firebase Hosting (Static Site Hosting)                     │
│  Firebase Functions (Optional Serverless Functions)         │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Offline-First Approach

All data operations go through the local SQLite database first:

```
User Action → SQLite Adapter → Local Database → UI Update
                    ↓
              Sync Service
                    ↓
            Firebase Adapter → Cloud Storage
```

### 2. Read Operations

```
1. Check local SQLite database
2. Return data immediately (fast response)
3. Background sync with Firebase
4. Update local database if cloud has newer data
```

### 3. Write Operations

```
1. Write to local SQLite database
2. Update UI immediately
3. Queue sync operation
4. Sync to Firebase in background
5. Handle conflicts if necessary
```

## Key Components

### Frontend (React + TypeScript)

- **Pages**: Route-level components
  - `Home.tsx`: Blog post listing
  - `NewPost.tsx`: Create new blog post
  - `EditPost.tsx`: Edit existing post
  - `PostView.tsx`: View single post
  - `login.tsx`: Authentication page

- **Components**: Reusable UI components
  - `MarkdownEditor.tsx`: Rich markdown editing
  - `MarkdownPreview.tsx`: Live markdown preview
  - `ImageUploader.tsx`: Image upload handling
  - `Header.tsx`, `Footer.tsx`: Layout components

- **Contexts**:
  - `AuthContext.tsx`: Global authentication state

### Services Layer

- **sqliteAdapter.ts**: Local database operations using sql.js
- **firebaseAdapter.ts**: Cloud database operations using Firestore
- **syncService.ts**: Bidirectional synchronization logic
- **authService.ts**: Authentication operations

### State Management

- React Context API for global state (Authentication)
- Local component state for UI state
- SQLite for persistent data storage

## Technology Stack

### Core Technologies
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework

### Data & Storage
- **sql.js**: SQLite compiled to WebAssembly
- **Firebase Firestore**: Cloud NoSQL database
- **Firebase Storage**: Cloud file storage
- **localStorage**: Browser storage for SQLite persistence

### Authentication & Backend
- **Firebase Authentication**: User authentication
- **Firebase Functions**: Serverless backend (optional)
- **Firebase Hosting**: Static site hosting

### Development & Testing
- **Jest**: Unit testing
- **Playwright**: End-to-end testing
- **ESLint**: Code linting
- **GitHub Actions**: CI/CD pipeline

## Security Architecture

### Authentication Flow

```
1. User enters credentials
2. Firebase Auth validates
3. JWT token issued
4. Token stored in browser
5. Token included in all Firebase requests
6. Firestore rules validate token
```

### Security Rules

- **Firestore Rules**: Server-side data access control
- **Storage Rules**: File upload/download permissions
- **Environment Variables**: Sensitive config stored securely

### Data Protection

- All Firebase communication over HTTPS
- JWT tokens for authentication
- Server-side validation via Firestore rules
- No sensitive data in client-side code

## Performance Optimizations

1. **Code Splitting**: Dynamic imports for routes
2. **Lazy Loading**: Components loaded on demand
3. **Local-First**: Instant UI updates with local database
4. **Background Sync**: Non-blocking cloud synchronization
5. **Image Optimization**: Compressed uploads to Firebase Storage

## Scalability Considerations

- **Firestore**: Scales automatically with usage
- **Firebase Storage**: CDN-backed file delivery
- **Firebase Hosting**: Global CDN distribution
- **Client-Side Rendering**: Reduces server load
- **Offline Support**: Reduces API calls

## Future Enhancements

- [ ] Service Worker for true offline support
- [ ] Real-time collaboration using Firestore listeners
- [ ] Image optimization pipeline
- [ ] Full-text search with Algolia or similar
- [ ] Analytics integration
- [ ] Progressive Web App (PWA) features

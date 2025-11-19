# BIT2208 Blog

A modern, offline-first blog application built with React, TypeScript, and Firebase. Features local-first architecture with two-way sync, markdown editing, and image uploads.

## 🚀 Features

- **Offline-First Architecture**: Local SQLite database (sql.js) with localStorage persistence
- **Two-Way Sync**: Seamless synchronization with Firebase (Firestore + Storage)
- **Markdown Editor**: Rich markdown editing with live preview and syntax highlighting
- **Authentication**: Secure user authentication via Firebase Auth
- **Image Uploads**: Direct image uploads to Firebase Storage
- **Responsive Design**: Built with Tailwind CSS for mobile-first experience
- **Type-Safe**: Full TypeScript implementation

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm or yarn
- Firebase project (for production deployment)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bit2208-blog
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## 🌐 Live Demo

**Visit the live application**: https://bit2208-blog-prod.web.app

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Running with Firebase Emulators

```bash
npm run emulators:start
```

## 🧪 Testing

Run unit tests:
```bash
npm test
```

Run end-to-end tests:
```bash
npm run test:e2e
```

Run all tests (CI mode):
```bash
npm run ci
```

## 🏗️ Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📦 Deployment

### Firebase Hosting

1. **Install Firebase CLI** (if not already installed)
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Build and deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

   Or use the deployment helper script:
   ```bash
   ./deploy.sh
   ```

### CI/CD with GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:
- Runs linting and tests on every push and pull request
- Can automatically deploy to Firebase Hosting (requires configuration)

For automated deployments, see [docs/ci-secrets.md](docs/ci-secrets.md)

## 📁 Project Structure

```
bit2208-blog/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # Firebase and database services
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── public/              # Static assets
├── docs/                # Additional documentation
├── e2e/                 # End-to-end tests
├── functions/           # Firebase Cloud Functions
└── dataconnect/         # Firebase Data Connect configuration
```

## 🔒 Security

- Firestore and Storage security rules are configured in `firestore.rules` and `storage.rules`
- Review and customize these rules before production deployment
- Never commit service account keys or sensitive credentials
- Use environment variables for all configuration

## 📚 Documentation

### Quick Links
- **[Documentation Index](DOCUMENTATION_INDEX.md)** - Complete documentation guide
- **[Quick Reference](QUICK_REFERENCE.md)** - Common commands and snippets
- **[Project Summary](PROJECT_SUMMARY.md)** - Professional project overview

### Technical Documentation
- **[Architecture](docs/ARCHITECTURE.md)** - System design and data flow
- **[API Reference](docs/API.md)** - Complete API documentation
- **[Contributing](CONTRIBUTING.md)** - Development guidelines

### Deployment & Setup
- **[Firebase Setup](docs/firebase-setup.md)** - Firebase configuration
- **[Deployment Guide](docs/deployment.md)** - Deployment instructions
- **[CI/CD Secrets](docs/ci-secrets.md)** - CI/CD configuration

### Project Information
- **[Changelog](CHANGELOG.md)** - Version history
- **[License](LICENSE)** - MIT License
- **[Portfolio Showcase](PROJECT_SHOWCASE.md)** - Project highlights

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Database**: sql.js (local), Firebase Firestore (cloud)
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth
- **Testing**: Jest, Playwright
- **CI/CD**: GitHub Actions

## 📝 License

This project is part of the BIT2208 course.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or support, please open an issue in the repository.

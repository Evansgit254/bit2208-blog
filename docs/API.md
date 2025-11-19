# API Documentation

## Service Layer APIs

### SQLite Adapter (`services/sqliteAdapter.ts`)

Local database operations using sql.js.

#### `initDatabase(): Promise<void>`
Initializes the SQLite database and creates necessary tables.

```typescript
await initDatabase();
```

#### `getAllPosts(): Promise<Post[]>`
Retrieves all blog posts from local database.

```typescript
const posts = await getAllPosts();
```

#### `getPostById(id: string): Promise<Post | null>`
Retrieves a single post by ID.

```typescript
const post = await getPostById('post-123');
```

#### `createPost(post: Omit<Post, 'id'>): Promise<Post>`
Creates a new blog post in local database.

```typescript
const newPost = await createPost({
  title: 'My Blog Post',
  content: 'Post content...',
  authorId: 'user-123',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

#### `updatePost(id: string, updates: Partial<Post>): Promise<Post>`
Updates an existing post.

```typescript
const updated = await updatePost('post-123', {
  title: 'Updated Title',
  updatedAt: new Date()
});
```

#### `deletePost(id: string): Promise<void>`
Deletes a post from local database.

```typescript
await deletePost('post-123');
```

---

### Firebase Adapter (`services/firebaseAdapter.ts`)

Cloud database operations using Firebase Firestore.

#### `syncPostToFirebase(post: Post): Promise<void>`
Syncs a post to Firebase Firestore.

```typescript
await syncPostToFirebase(post);
```

#### `getPostsFromFirebase(): Promise<Post[]>`
Retrieves all posts from Firestore.

```typescript
const posts = await getPostsFromFirebase();
```

#### `getPostFromFirebase(id: string): Promise<Post | null>`
Retrieves a single post from Firestore.

```typescript
const post = await getPostFromFirebase('post-123');
```

#### `deletePostFromFirebase(id: string): Promise<void>`
Deletes a post from Firestore.

```typescript
await deletePostFromFirebase('post-123');
```

#### `uploadImage(file: File, postId: string): Promise<string>`
Uploads an image to Firebase Storage and returns the download URL.

```typescript
const imageUrl = await uploadImage(imageFile, 'post-123');
```

---

### Sync Service (`services/syncService.ts`)

Handles bidirectional synchronization between local and cloud storage.

#### `syncAllPosts(): Promise<void>`
Synchronizes all posts between local database and Firebase.

```typescript
await syncAllPosts();
```

#### `syncSinglePost(postId: string): Promise<void>`
Synchronizes a specific post.

```typescript
await syncSinglePost('post-123');
```

---

### Auth Service (`services/authService.ts`)

Authentication operations using Firebase Auth.

#### `signIn(email: string, password: string): Promise<User>`
Signs in a user with email and password.

```typescript
const user = await signIn('user@example.com', 'password123');
```

#### `signUp(email: string, password: string): Promise<User>`
Creates a new user account.

```typescript
const user = await signUp('user@example.com', 'password123');
```

#### `signOut(): Promise<void>`
Signs out the current user.

```typescript
await signOut();
```

#### `getCurrentUser(): User | null`
Gets the currently authenticated user.

```typescript
const user = getCurrentUser();
```

#### `onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe`
Listens for authentication state changes.

```typescript
const unsubscribe = onAuthStateChanged((user) => {
  if (user) {
    console.log('User signed in:', user.email);
  } else {
    console.log('User signed out');
  }
});

// Later: unsubscribe();
```

---

## Data Types

### Post

```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  authorId: string;
  authorName?: string;
  imageUrl?: string;
  tags?: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}
```

### User

```typescript
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
```

---

## React Hooks

### `useAuth()`

Custom hook for accessing authentication state.

```typescript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={() => signIn('email@example.com', 'password')}>
          Sign In
        </button>
      )}
    </div>
  );
}
```

**Returns:**
- `user`: Current user object or null
- `loading`: Boolean indicating auth state loading
- `signIn`: Function to sign in
- `signUp`: Function to sign up
- `signOut`: Function to sign out

---

## Context APIs

### AuthContext

Provides global authentication state.

```typescript
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function MyComponent() {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('Component must be wrapped in AuthProvider');
  }
  
  const { user, loading } = authContext;
  // ...
}
```

---

## Firebase Configuration

### Environment Variables

Required environment variables for Firebase:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firebase Initialization

Firebase is initialized in `services/firebase-config.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

## Error Handling

All service methods should handle errors appropriately:

```typescript
try {
  const post = await getPostById('post-123');
  if (!post) {
    console.error('Post not found');
    return;
  }
  // Handle post
} catch (error) {
  console.error('Error fetching post:', error);
  // Show user-friendly error message
}
```

---

## Best Practices

1. **Always use TypeScript types** for type safety
2. **Handle loading states** in UI components
3. **Implement error boundaries** for graceful error handling
4. **Use async/await** for cleaner asynchronous code
5. **Validate data** before sending to Firebase
6. **Optimize Firestore queries** to reduce costs
7. **Cache data locally** to reduce API calls
8. **Use environment variables** for configuration

export interface Post {
  id: string;
  title: string;
  body: string;
  images?: string[];
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  authorId?: string;
  isDraft?: boolean;
  isPublished?: boolean;
  synced: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
}

export interface SyncStatus {
  lastSynced: Date | null;
  pendingChanges: number;
  isOnline: boolean;
}

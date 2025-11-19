import firebaseAdapter from './firebaseAdapter';
import sqliteAdapter from './sqliteAdapter';
import type { Post } from '../types/Post';

type NewPost = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'synced'>;

class SyncService {
  private isSyncing = false;
  private isOnline = navigator.onLine;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnlineStatusChange.bind(this));
    window.addEventListener('offline', this.handleOnlineStatusChange.bind(this));
  }

  // For E2E tests we support a simple localStorage-backed mode. Enable by
  // setting localStorage.setItem('e2e_mode', '1') before the app initializes.
  private isE2EMode(): boolean {
    try {
      return typeof window !== 'undefined' && !!localStorage.getItem('e2e_mode');
    } catch (_e) {
      // localStorage not available
      return false;
    }
  }

  private handleOnlineStatusChange() {
    this.isOnline = navigator.onLine;
    if (this.isOnline) {
      this.syncPosts().catch(console.error);
    }
  }

  async syncPosts(): Promise<void> {
    if (!this.isOnline || this.isSyncing) return;

    try {
      this.isSyncing = true;

      // Get all unsynced local posts
      const unsyncedPosts = await sqliteAdapter.getUnsyncedPosts();

      // Sync each unsynced post to Firebase
      for (const post of unsyncedPosts) {
        if (!post.id) continue;
        
        try {
          await firebaseAdapter.savePost({
            ...post,
            synced: true,
            images: post.images || []
          });
          await sqliteAdapter.markAsSynced(post.id);
        } catch (error) {
          console.error(`Failed to sync post ${post.id}:`, error);
          // Continue with next post even if one fails
        }
      }

      // Get all posts from Firebase that were created/updated after our last sync
      const remoteChanges = await this.getRemoteChanges();

      // Apply remote changes to local database
      for (const post of remoteChanges) {
        if (!post.id) continue;
        
        try {
          const localPost = await sqliteAdapter.getPost(post.id);
          if (!localPost || localPost.updatedAt < post.updatedAt) {
            await sqliteAdapter.updatePost({
              ...post,
              synced: true,
              images: post.images || []
            });
          }
        } catch (error) {
          console.error(`Failed to apply remote changes for post ${post.id}:`, error);
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  private async getRemoteChanges(): Promise<Post[]> {
    try {
      // Get all posts from Firebase - in a real app, you'd want to implement
      // pagination and only fetch posts that have changed since last sync
      const posts = await firebaseAdapter.getAllPosts();
      return posts.map(post => ({
        ...post,
        images: post.images || []
      }));
    } catch (error) {
      console.error('Failed to get remote changes:', error);
      return [];
    }
  }

  async createPost(post: NewPost): Promise<Post> {
    console.log('[syncService] createPost called, isE2EMode:', this.isE2EMode());
    // If running in e2e mode, save to a simple localStorage-backed list so
    // tests don't depend on sql.js / WASM initialization.
    if (this.isE2EMode()) {
      const now = Date.now();
      const id = `post_${now}_${Math.random().toString(36).substr(2, 9)}`;
      const postsRaw = localStorage.getItem('e2e_posts');
      const posts = postsRaw ? JSON.parse(postsRaw) as Post[] : [];
      const newPost: Post = {
        id,
        title: post.title,
        body: post.body,
        images: post.images || [],
        createdAt: now,
        updatedAt: now,
        synced: true
      };
      posts.unshift(newPost);
      localStorage.setItem('e2e_posts', JSON.stringify(posts));
      // Also write a JSON fallback used by sqliteAdapter in-memory path
      try {
        localStorage.setItem('blog_database_json', JSON.stringify(posts));
      } catch (_e) {
        // localStorage not available
      }
      // Expose last created id to help tests and dispatch an event
      try {
        localStorage.setItem('e2e_last_created', newPost.id);
        window.dispatchEvent(new CustomEvent('e2e:post-created', { detail: { id: newPost.id } }));
      } catch (_e) {
        // Event dispatch failed
      }
      // Helpful debug during E2E runs
      try { 
        console.log('[syncService][e2e] created post', newPost.id); 
      } catch (_e) {
        // Console not available
      }
      return newPost;
    }

    // Always save to local first
    const savedPost = await sqliteAdapter.savePost(post);

    // If online, try to sync immediately
    if (this.isOnline) {
      try {
        await firebaseAdapter.savePost({
          ...savedPost,
          synced: true,
          images: savedPost.images || []
        });
        await sqliteAdapter.markAsSynced(savedPost.id);
        return { ...savedPost, synced: true };
      } catch (error) {
        console.error('Failed to sync new post:', error);
      }
    }

    return savedPost;
  }

  async updatePost(post: Post): Promise<Post> {
    if (this.isE2EMode()) {
      const postsRaw = localStorage.getItem('e2e_posts');
      const posts = postsRaw ? JSON.parse(postsRaw) as Post[] : [];
      const idx = posts.findIndex(p => p.id === post.id);
      const now = Date.now();
      if (idx !== -1) {
        posts[idx] = { ...post, updatedAt: now, synced: true };
        localStorage.setItem('e2e_posts', JSON.stringify(posts));
        return posts[idx];
      }
      // If not found, fall through to sqlite update
    }

    // Always update local first
    const updatedPost = await sqliteAdapter.updatePost({
      ...post,
      synced: false
    });

    // If online, try to sync immediately
    if (this.isOnline) {
      try {
        await firebaseAdapter.savePost({
          ...updatedPost,
          synced: true,
          images: updatedPost.images || []
        });
        await sqliteAdapter.markAsSynced(updatedPost.id);
        return { ...updatedPost, synced: true };
      } catch (error) {
        console.error('Failed to sync post update:', error);
      }
    }

    return updatedPost;
  }

  async deletePost(id: string): Promise<void> {
    // If e2e mode, remove from localStorage-backed posts
    if (this.isE2EMode()) {
      const postsRaw = localStorage.getItem('e2e_posts');
      const posts = postsRaw ? JSON.parse(postsRaw) as Post[] : [];
      const filtered = posts.filter(p => p.id !== id);
      localStorage.setItem('e2e_posts', JSON.stringify(filtered));
      return;
    }

    // Delete locally first
    await sqliteAdapter.deletePost(id);

    // If online, try to delete from Firebase
    if (this.isOnline) {
      try {
        await firebaseAdapter.deletePost(id);
      } catch (error) {
        console.error('Failed to sync post deletion:', error);
      }
    }
  }

  async getPosts(): Promise<Post[]> {
    // E2E mode: return posts from localStorage if present
    if (this.isE2EMode()) {
      const postsRaw = localStorage.getItem('e2e_posts');
      const posts = postsRaw ? JSON.parse(postsRaw) as Post[] : [];
      return posts.map(p => ({ ...p, images: p.images || [] }));
    }

    // Always return local posts first for instant response
    const posts = await sqliteAdapter.getPosts();
    return posts.map(post => ({
      ...post,
      images: post.images || []
    }));
  }

  async getPost(id: string): Promise<Post | null> {
    if (this.isE2EMode()) {
      const postsRaw = localStorage.getItem('e2e_posts');
      const posts = postsRaw ? JSON.parse(postsRaw) as Post[] : [];
      const found = posts.find(p => p.id === id) || null;
      return found ? { ...found, images: found.images || [] } : null;
    }

    // Always return local post first for instant response
    const post = await sqliteAdapter.getPost(id);
    return post ? {
      ...post,
      images: post.images || []
    } : null;
  }
}

export default new SyncService();
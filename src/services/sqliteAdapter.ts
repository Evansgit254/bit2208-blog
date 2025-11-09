/* eslint-disable @typescript-eslint/no-explicit-any */
import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';
import type { Post } from '../types/Post';

class SQLiteAdapter {
  private db: Database | null = null;
  private initialized = false;
  private useMemory = false;
  private memoryPosts: Post[] = [];

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });

      // Try to load existing database from localStorage
      const savedDb = localStorage.getItem('blog_database');
      if (savedDb) {
        const buffer = this.base64ToUint8Array(savedDb);
        this.db = new SQL.Database(buffer);
      } else {
        this.db = new SQL.Database();
        this.createTables();
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize SQLite (falling back to in-memory):', error);
      // Fall back to an in-memory JS implementation for environments where
      // the SQL.js WASM cannot be loaded (e.g. Playwright preview with limited network).
      this.useMemory = true;
      // Try to hydrate any previously-saved JSON fallback
      try {
        const saved = localStorage.getItem('blog_database_json');
        if (saved) {
          this.memoryPosts = JSON.parse(saved) as Post[];
        } else {
          this.memoryPosts = [];
        }
      } catch (e) {
        this.memoryPosts = [];
      }
      this.initialized = true;
    }
  }

  private createTables(): void {
    if (!this.db) throw new Error('Database not initialized');

    this.db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        images TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        synced INTEGER DEFAULT 0
      )
    `);

    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    if (!this.db) return;
    const data = this.db.export();
    const base64 = this.uint8ArrayToBase64(data);
    localStorage.setItem('blog_database', base64);
  }

  private uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = '';
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  async getPosts(): Promise<Post[]> {
    await this.initialize();
    if (this.useMemory) {
      // Return a shallow copy sorted by createdAt desc
      return [...this.memoryPosts].sort((a, b) => b.createdAt - a.createdAt);
    }

    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM posts ORDER BY createdAt DESC');
    if (result.length === 0) return [];

    const posts: Post[] = [];
    const columns = result[0].columns;
    const values = result[0].values;

    values.forEach(row => {
      const post: any = {};
      columns.forEach((col, index) => {
        post[col] = row[index];
      });

      posts.push({
        id: post.id,
        title: post.title,
        body: post.body,
        images: post.images ? JSON.parse(post.images) : [],
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        synced: post.synced === 1
      });
    });

    return posts;
  }

  async getPost(id: string): Promise<Post | null> {
    await this.initialize();
    if (this.useMemory) {
      const found = this.memoryPosts.find(p => p.id === id) || null;
      return found;
    }

    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM posts WHERE id = ?', [id]);
    if (result.length === 0 || result[0].values.length === 0) return null;

    const row = result[0].values[0];
    const columns = result[0].columns;
    const post: any = {};
    columns.forEach((col, index) => {
      post[col] = row[index];
    });

    return {
      id: post.id,
      title: post.title,
      body: post.body,
      images: post.images ? JSON.parse(post.images) : [],
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      synced: post.synced === 1
    };
  }

  async savePost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'synced'>): Promise<Post> {
    await this.initialize();
    if (this.useMemory) {
      const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();
      const newPost: Post = {
        id,
        title: post.title,
        body: post.body,
        images: post.images || [],
        createdAt: now,
        updatedAt: now,
        synced: false
      };
      this.memoryPosts.push(newPost);
      try { localStorage.setItem('blog_database_json', JSON.stringify(this.memoryPosts)); } catch {}
      return newPost;
    }

    if (!this.db) throw new Error('Database not initialized');

    const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const images = JSON.stringify(post.images || []);

    this.db.run(
      'INSERT INTO posts (id, title, body, images, createdAt, updatedAt, synced) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, post.title, post.body, images, now, now, 0]
    );

    this.saveToLocalStorage();

    return {
      id,
      title: post.title,
      body: post.body,
      images: post.images,
      createdAt: now,
      updatedAt: now,
      synced: false
    };
  }

  async updatePost(post: Post): Promise<Post> {
    await this.initialize();
    if (this.useMemory) {
      const idx = this.memoryPosts.findIndex(p => p.id === post.id);
      const now = Date.now();
      if (idx >= 0) {
        this.memoryPosts[idx] = { ...post, updatedAt: now, synced: false };
        try { localStorage.setItem('blog_database_json', JSON.stringify(this.memoryPosts)); } catch {}
        return this.memoryPosts[idx];
      }
      throw new Error('Post not found');
    }

    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    const images = JSON.stringify(post.images || []);

    this.db.run(
      'UPDATE posts SET title = ?, body = ?, images = ?, updatedAt = ?, synced = ? WHERE id = ?',
      [post.title, post.body, images, now, 0, post.id]
    );

    this.saveToLocalStorage();

    return { ...post, updatedAt: now, synced: false };
  }

  async deletePost(id: string): Promise<void> {
    await this.initialize();
    if (this.useMemory) {
      this.memoryPosts = this.memoryPosts.filter(p => p.id !== id);
      try { localStorage.setItem('blog_database_json', JSON.stringify(this.memoryPosts)); } catch {}
      return;
    }

    if (!this.db) throw new Error('Database not initialized');

    this.db.run('DELETE FROM posts WHERE id = ?', [id]);
    this.saveToLocalStorage();
  }

  async getUnsyncedPosts(): Promise<Post[]> {
    await this.initialize();
    if (this.useMemory) {
      return this.memoryPosts.filter(p => !p.synced);
    }

    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.exec('SELECT * FROM posts WHERE synced = 0');
    if (result.length === 0) return [];

    const posts: Post[] = [];
    const columns = result[0].columns;
    const values = result[0].values;

    values.forEach(row => {
      const post: any = {};
      columns.forEach((col, index) => {
        post[col] = row[index];
      });

      posts.push({
        id: post.id,
        title: post.title,
        body: post.body,
        images: post.images ? JSON.parse(post.images) : [],
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        synced: false
      });
    });

    return posts;
  }

  async markAsSynced(id: string): Promise<void> {
    await this.initialize();
    if (this.useMemory) {
      const idx = this.memoryPosts.findIndex(p => p.id === id);
      if (idx >= 0) this.memoryPosts[idx].synced = true;
      try { localStorage.setItem('blog_database_json', JSON.stringify(this.memoryPosts)); } catch {}
      return;
    }

    if (!this.db) throw new Error('Database not initialized');

    this.db.run('UPDATE posts SET synced = 1 WHERE id = ?', [id]);
    this.saveToLocalStorage();
  }
}

export default new SQLiteAdapter();
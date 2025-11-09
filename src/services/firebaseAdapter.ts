import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebaseConfig';
import type { Post } from '../types/Post';

class FirebaseAdapter {
  private postsCollection = collection(db, 'posts');

  async savePost(post: Post): Promise<Post> {
    try {
      const docRef = await addDoc(this.postsCollection, {
        ...post,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        synced: true
      });
      
      return {
        ...post,
        id: docRef.id,
        synced: true
      };
    } catch (error) {
      console.error('Error saving post to Firebase:', error);
      throw error;
    }
  }

  async updatePost(postId: string, post: Partial<Post>): Promise<void> {
    try {
      const docRef = doc(this.postsCollection, postId);
      await updateDoc(docRef, {
        ...post,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error updating post in Firebase:', error);
      throw error;
    }
  }

  async deletePost(postId: string): Promise<void> {
    try {
      const docRef = doc(this.postsCollection, postId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting post from Firebase:', error);
      throw error;
    }
  }

  async getPost(postId: string): Promise<Post | null> {
    try {
      const docRef = doc(this.postsCollection, postId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Post;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting post from Firebase:', error);
      throw error;
    }
  }

  async getAllPosts(): Promise<Post[]> {
    try {
      const querySnapshot = await getDocs(this.postsCollection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
    } catch (error) {
      console.error('Error getting all posts from Firebase:', error);
      throw error;
    }
  }

  async getPublishedPosts(): Promise<Post[]> {
    try {
      const q = query(this.postsCollection, where("isPublished", "==", true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
    } catch (error) {
      console.error('Error getting published posts from Firebase:', error);
      throw error;
    }
  }

  async uploadImage(file: File, postId: string): Promise<string> {
    try {
      const storageRef = ref(storage, `posts/${postId}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image to Firebase Storage:', error);
      throw error;
    }
  }
}

export const firebaseAdapter = new FirebaseAdapter();
export default firebaseAdapter;

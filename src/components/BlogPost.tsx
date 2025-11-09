import { type FC, useState, useCallback } from 'react';

import { Save, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MarkdownEditor from './MarkdownEditor';
import { firebaseAdapter } from '../services/firebaseAdapter';
import syncService from '../services/syncService';
import type { Post } from '../types/Post';

interface BlogPostProps {
  post?: Post;
  onSave?: () => void;
  onDelete?: () => void;
}

export const BlogPost: FC<BlogPostProps> = ({
  post,
  onSave,
  onDelete,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.body || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const postData = {
        title,
        body: content,
        images: [],
        authorId: user?.id,
        isDraft: false,
        isPublished: true
      };

      if (post) {
        await syncService.updatePost({
          ...post,
          ...postData
        });
      } else {
        await syncService.createPost(postData);
      }

      onSave?.();
      // show a short-lived success message for e2e tests and UX
      setSuccessMessage('Post saved');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  }, [title, content, post, user, onSave]);

  const handleDelete = useCallback(async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setError(null);
      await syncService.deletePost(post.id);
      onDelete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  }, [post, onDelete]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!post) {
      throw new Error('Must save post before uploading images');
    }
    return await firebaseAdapter.uploadImage(file, post.id);
  }, [post]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full text-3xl font-bold border-b border-gray-200 pb-2 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <MarkdownEditor
        initialValue={content}
        onChange={setContent}
        onImageUpload={post ? handleImageUpload : undefined}
      />

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {successMessage && (
        <div role="status" className="text-green-600 text-sm">{successMessage}</div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          {post && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

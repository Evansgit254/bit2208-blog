import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import syncService from '../services/syncService';
import MarkdownPreview from '../components/MarkdownPreview';
import type { Post } from '../types/Post';

const PostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const p = await syncService.getPost(id);
        if (mounted) setPost(p);
      } catch (err) {
        console.error('Failed to load post', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="p-6">Loading post...</div>;
  if (!post) return (
    <div className="p-6">
      <div className="text-gray-600">Post not found.</div>
      <Link to="/" className="text-indigo-600 hover:underline">Back to home</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-6">{new Date(post.createdAt).toLocaleString()}</div>
      <div className="prose max-w-none">
        <MarkdownPreview content={post.body} />
      </div>
      <div className="mt-6">
        <Link to={`/edit/${post.id}`} className="text-indigo-600 hover:underline mr-4">Edit</Link>
        <Link to="/" className="text-indigo-600 hover:underline">Back to home</Link>
      </div>
    </div>
  );
};

export default PostView;

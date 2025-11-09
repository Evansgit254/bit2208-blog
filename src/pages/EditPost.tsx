import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlogPost from '../components/BlogPost';
import syncService from '../services/syncService';
import type { Post } from '../types/Post';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const p = await syncService.getPost(id);
        if (mounted && p) setPost(p);
      } catch (err) {
        console.error('Failed to load post for edit', err);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleSave = () => {
    // After saving an edit, navigate to the post view so tests can assert
    if (id) navigate(`/posts/${id}`);
    else navigate('/');
  };

  return post ? <BlogPost post={post} onSave={handleSave} onDelete={() => navigate('/')} /> : <div className="p-6">Loading post for edit...</div>;
};

export default EditPost;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlogPost from '../components/BlogPost';

const NewPost: React.FC = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    // After creating a new post, navigate back to home so the listing reloads
    navigate('/');
  };

  return <BlogPost onSave={handleSave} />;
};

export default NewPost;

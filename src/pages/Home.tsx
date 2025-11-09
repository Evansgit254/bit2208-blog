import React, { useEffect, useState, useCallback } from 'react';
import syncService from '../services/syncService';
import type { Post } from '../types/Post';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtered, setFiltered] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await syncService.getPosts();
      setPosts(data);
      setFiltered(data);
    } catch (err) {
      console.error('Failed to load posts', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Optionally subscribe to periodic refresh or sync events
  }, [load]);

  const handleSearch = (query: string) => {
    if (!query) {
      setFiltered(posts);
      return;
    }

    const q = query.toLowerCase();
    setFiltered(posts.filter(p => (p.title + ' ' + p.body).toLowerCase().includes(q)));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Latest Posts</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading ? (
        <div>Loading posts...</div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 && <div className="text-gray-500">No posts found</div>}
          {filtered.map(post => (
            <article key={post.id} className="p-4 bg-white rounded-md shadow-sm">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{post.body}</p>
              <div className="mt-3 flex items-center justify-between">
                <div data-testid="post-date" className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
                <div className="flex gap-2">
                  <Link to={`/edit/${post.id}`} className="text-indigo-600 hover:underline">Edit</Link>
                  <Link to={`/posts/${post.id}`} className="text-indigo-600 hover:underline">View</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

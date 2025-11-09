/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlogPost from '../BlogPost';
import * as syncService from '../../services/syncService';
// Mock syncService
jest.mock('../../services/syncService', () => ({
  createPost: jest.fn(async (p: any) => ({
    id: 'post_test_1',
    title: p.title,
    body: p.body,
    images: p.images || [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    synced: true
  })),
  updatePost: jest.fn(async (p: any) => p),
  deletePost: jest.fn()
}));

// Mock useAuth to provide an admin user
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', email: 'a@b.com', name: 'Test', role: 'admin' },
    loading: false,
    error: null,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn()
  })
}));

describe('BlogPost integration', () => {
  it('creates a post when Save is clicked', async () => {
    render(<BlogPost />);

    const titleInput = screen.getByPlaceholderText('Post title');
    const textarea = screen.getByPlaceholderText('Write your post in Markdown...');
    const saveBtn = screen.getByRole('button', { name: /save/i });

    fireEvent.change(titleInput, { target: { value: 'Integration Test' } });
    fireEvent.change(textarea, { target: { value: 'This is the body' } });

    fireEvent.click(saveBtn);

  const mod = syncService as any;
  await waitFor(() => expect(mod.createPost).toHaveBeenCalled());
  });
});

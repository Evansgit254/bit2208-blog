/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import React from 'react';

// Centralized mocks for ESM-only modules and Firebase used in tests.
// This ensures Jest doesn't try to parse ESM-only packages and keeps tests deterministic.
jest.mock('react-markdown', () => ({ __esModule: true, default: (p: any) => React.createElement('div', null, p.children) }));
jest.mock('remark-gfm', () => ({}));
jest.mock('react-syntax-highlighter', () => ({ Prism: (p: any) => React.createElement('pre', null, p.children) }));
jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({ vscDarkPlus: {} }));

// Mock firebaseConfig so import.meta references don't cause runtime errors in Jest.
jest.mock('./services/firebaseConfig', () => ({
	apiKey: 'test',
	authDomain: 'test',
	projectId: 'test',
	storageBucket: 'test',
	messagingSenderId: 'test',
	appId: 'test'
}));

// Mock firebaseAdapter to avoid network calls during tests.
jest.mock('./services/firebaseAdapter', () => ({
	firebaseAdapter: {
		uploadImage: jest.fn(async (file: File, id: string) => `https://example.com/${id}/${file.name}`)
	}
}));

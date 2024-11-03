import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

const mockNavigate = vi.fn();

// Mock useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Home', () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockNavigate.mockClear();
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  it('renders github link', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    // Find link by its aria-label
    const githubLink = screen.getByRole('link', { 
      name: 'View on GitHub'
    });
    
    expect(githubLink).toBeInTheDocument();
    expect(githubLink.getAttribute('href')).toBe('https://github.com/promptengineers-ai/llm-server');
  });

  it('redirects to chat when token exists', () => {
    // Setup localStorage with token
    window.localStorage.setItem('token', 'fake-token');

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Check if navigation was called
    expect(mockNavigate).toHaveBeenCalledWith('/chat');
  });
}); 
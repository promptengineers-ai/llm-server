import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('renders outlet component', () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // The App component just renders an Outlet, so the container should exist
    // but be empty until routes are rendered
    expect(container).toBeDefined();
    expect(container.firstChild).toBeNull();
  });
}); 
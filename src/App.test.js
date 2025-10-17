import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, afterEach, expect } from 'vitest';
import App from './App.jsx';

describe('App', () => {
  afterEach(() => cleanup());
  it('renders without crashing', () => {
    const { unmount } = render(<App />);
    expect(document.body).toBeDefined();
    unmount();
  });
});

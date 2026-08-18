import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../app';

describe('App', () => {
  it('renders the home page at root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('STAT')).toBeDefined();
    expect(screen.getByText('-FORCE')).toBeDefined();
    expect(screen.getByText(/Discover ideas/)).toBeDefined();
    expect(screen.getByText(/Build what matters/)).toBeDefined();
  });

  it('renders the Discover page', () => {
    render(
      <MemoryRouter initialEntries={['/discover']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText("India's emerging ideas")).toBeDefined();
    expect(screen.getByText('AI Crop Disease Detection')).toBeDefined();
  });

  it('renders the Research page', () => {
    render(
      <MemoryRouter initialEntries={['/research']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('Research intelligence')).toBeDefined();
  });

  it('renders the Build page', () => {
    render(
      <MemoryRouter initialEntries={['/build']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('Turn an idea into a project')).toBeDefined();
  });

  it('renders the Messages page', () => {
    render(
      <MemoryRouter initialEntries={['/messages']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('Communication')).toBeDefined();
  });

  it('renders the Profile page', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('Your innovation profile')).toBeDefined();
  });

  it('renders the IdeaDetails page with param', () => {
    render(
      <MemoryRouter initialEntries={['/idea/42']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('Idea 42')).toBeDefined();
  });

  it('redirects unknown routes to home', () => {
    render(
      <MemoryRouter initialEntries={['/nonexistent']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Discover ideas/)).toBeDefined();
  });
});

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

import { App } from './app';
import { AuthProvider } from './context/AuthContext';

import './styles.css';

const httpLink = new HttpLink({
  uri:
    import.meta.env.VITE_API_URL ??
    'http://localhost:4000/graphql',

  credentials: 'include',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

createRoot(
  document.getElementById('root')!,
).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
);
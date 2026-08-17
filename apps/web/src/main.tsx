import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { App } from './app';
import './styles.css';

const client = new ApolloClient({
  link: new HttpLink({ uri: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/graphql' }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
);

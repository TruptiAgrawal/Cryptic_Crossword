import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          900: { value: '#1a365d' },
          800: { value: '#153e75' },
          700: { value: '#2a69ac' },
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ChakraProvider>
  </React.StrictMode>
);
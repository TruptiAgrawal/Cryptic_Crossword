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
    fonts: {
      heading: "'Playfair Display', Georgia, serif",
      body: "'Merriweather', 'Times New Roman', serif",
      mono: "'Roboto Mono', 'Courier New', monospace",
    },
    components: {
      Button: {
        baseStyle: {
          borderRadius: '0',
          _hover: {
            bg: '#333',
            color: '#FFF',
          },
        },
        variants: {
          solid: {
            bg: '#EFEFEF',
            color: '#333',
            border: '1px solid #555',
            _hover: {
              bg: '#333',
              color: '#FFF',
            },
          },
        },
      },
      Input: {
        baseStyle: {
          field: {
            borderRadius: '0',
            border: '1px solid #666',
            _focus: {
              borderColor: '#333',
              boxShadow: 'none',
            },
          },
        },
      },
      Textarea: {
        baseStyle: {
          borderRadius: '0',
          border: '1px solid #666',
          bg: '#F8F8F8',
          _focus: {
            borderColor: '#333',
            boxShadow: 'none',
          },
        },
      },
      Badge: {
        baseStyle: {
          borderRadius: '0',
          bg: 'transparent',
          color: '#444',
          border: '1px solid #888',
          fontSize: '0.7em',
          fontWeight: '600',
          textTransform: 'uppercase',
          padding: '2px 6px',
        },
        variants: {
          subtle: {
            bg: 'transparent',
            color: '#444',
          },
          solid: {
            bg: 'transparent',
            color: '#444',
          },
          outline: {
            bg: 'transparent',
            color: '#444',
          },
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
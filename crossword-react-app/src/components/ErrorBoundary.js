import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box textAlign="center" py={10} px={6}>
          <Heading as="h2" size="xl" mt={6} mb={2}>
            Oops! Something went wrong.
          </Heading>
          <Text color={'gray.500'}>
            We're sorry, but an unexpected error occurred. Please try refreshing the page.
          </Text>
          <Button mt={4} onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
          {/* Optional: Display error details in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box mt={4} p={4} bg="gray.100" borderRadius="md" textAlign="left">
              <Text fontWeight="bold">Error Details:</Text>
              <Text fontSize="sm" fontFamily="monospace">{this.state.error.toString()}</Text>
              <Text fontSize="sm" fontFamily="monospace" mt={2}>{this.state.errorInfo.componentStack}</Text>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

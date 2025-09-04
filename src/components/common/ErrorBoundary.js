import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>
              <i className="fas fa-exclamation-triangle me-2"></i>
              Oops! Something went wrong
            </Alert.Heading>
            <p>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <hr />
            <div className="d-flex gap-2">
              <Button 
                variant="outline-danger" 
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-redo me-2"></i>
                Refresh Page
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => window.location.href = '/'}
              >
                <i className="fas fa-home me-2"></i>
                Go Home
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-3">
                <summary>Error Details (Development Only)</summary>
                <pre className="mt-2 p-3 bg-light rounded small">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
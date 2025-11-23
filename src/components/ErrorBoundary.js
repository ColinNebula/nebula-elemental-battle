import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    
    // Log to analytics or error tracking service if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    // Clear local storage and reload
    if (window.confirm('This will reset all game data. Continue?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1>⚠️ Oops! Something went wrong</h1>
            <p className="error-message">
              The game encountered an unexpected error. This might be due to:
            </p>
            <ul className="error-reasons">
              <li>Low device memory</li>
              <li>Browser compatibility issues</li>
              <li>Corrupted game data</li>
              <li>Network connectivity problems</li>
            </ul>
            
            <div className="error-actions">
              <button className="error-btn primary" onClick={this.handleReload}>
                🔄 Reload Game
              </button>
              <button className="error-btn secondary" onClick={this.handleReset}>
                🗑️ Reset Game Data
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Technical Details (Dev Mode)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

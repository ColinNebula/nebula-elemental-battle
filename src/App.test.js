import { render, screen } from '@testing-library/react';
import App from './App';

// Mock security utils to prevent errors in test environment
jest.mock('./utils/security', () => ({
  default: {
    initialize: jest.fn(),
    validateInput: jest.fn(() => true),
    processCommand: jest.fn((cmd) => cmd),
    logSecurityEvent: jest.fn(),
  }
}));

// Mock InstallPrompt component
jest.mock('./components/InstallPrompt', () => {
  return function InstallPrompt() {
    return <div data-testid="install-prompt">Install Prompt</div>;
  };
});

test('renders nebula game app', () => {
  render(<App />);
  // Look for main menu or game title instead of "learn react"
  const gameElement = screen.getByTestId('app-container');
  expect(gameElement).toBeInTheDocument();
});

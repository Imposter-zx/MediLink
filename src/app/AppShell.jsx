import React from 'react';
import Navbar from './Navbar';
import ErrorBoundary from './ErrorBoundary';

/**
 * AppShell: The production layout wrapper.
 * Handles Navbar, global layout constraints, and Error Boundary isolation.
 */
const AppShell = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 transition-colors duration-300">
        <Navbar />
        <main className="relative">
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default AppShell;

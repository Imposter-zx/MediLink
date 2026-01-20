import React from 'react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4 text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Oops!</h1>
                    <p className="text-muted-foreground mb-8 max-w-md">
                        Something went wrong. We're sorry for the inconvenience.
                    </p>
                    <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8 text-sm font-mono max-w-lg overflow-auto border border-destructive/20">
                        {this.state.error?.toString()}
                    </div>
                    <Button onClick={() => window.location.href = '/'}>
                        Return Home
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

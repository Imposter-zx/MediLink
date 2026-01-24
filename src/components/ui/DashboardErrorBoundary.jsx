import React from 'react';
import Button from '../ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

class DashboardErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // In production, log to a service like Sentry
        console.error("Dashboard Error:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-destructive/5 rounded-3xl border border-destructive/10 text-center animate-in fade-in duration-300">
                    <div className="p-4 bg-destructive/10 text-destructive rounded-full mb-6">
                        <AlertCircle size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Unavailable</h2>
                    <p className="text-muted-foreground max-w-md mb-8">
                        We encountered an issue loading this section. Your data is safe, but we need to refresh the view.
                    </p>
                    <div className="bg-background/50 p-4 rounded-xl text-xs font-mono text-muted-foreground mb-8 max-w-sm overflow-hidden text-ellipsis whitespace-nowrap">
                        Error: {this.state.error?.message || 'Unknown Error'}
                    </div>
                    <Button onClick={this.handleRetry} className="gap-2 shadow-lg shadow-destructive/20">
                        <RefreshCw size={18} />
                        Reload Dashboard
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default DashboardErrorBoundary;

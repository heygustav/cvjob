import React, { Component, ErrorInfo } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
          <Alert variant="destructive" className="max-w-xl mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Der opstod en fejl</AlertTitle>
            <AlertDescription className="mt-2">
              <p>Beklager, men der opstod en uventet fejl. Prøv at genindlæse siden eller gå tilbage.</p>
              {this.state.error && (
                <pre className="mt-2 text-xs p-2 bg-destructive/10 rounded overflow-auto max-h-[200px]">
                  {this.state.error.toString()}
                </pre>
              )}
            </AlertDescription>
          </Alert>
          <div className="flex gap-4">
            <Button 
              variant="default" 
              onClick={this.handleReset}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Prøv igen
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              Gå til forsiden
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 

type LogLevel = 'info' | 'warning' | 'error' | 'critical';

interface ErrorLogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: Error;
  metadata?: Record<string, any>;
  context?: {
    userId?: string;
    action?: string;
    component?: string;
    [key: string]: any;
  };
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private isDebugMode: boolean;

  private constructor() {
    this.isDebugMode = process.env.NODE_ENV === 'development';
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  log(
    level: LogLevel,
    message: string,
    error?: Error,
    metadata?: Record<string, any>,
    context?: ErrorLogEntry['context']
  ) {
    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error,
      metadata,
      context
    };

    // Always log to console in development
    if (this.isDebugMode) {
      this.logToConsole(entry);
    }

    // In production, only log warnings and errors
    if (!this.isDebugMode && (level === 'warning' || level === 'error' || level === 'critical')) {
      this.logToConsole(entry);
    }

    // Here you could add more logging destinations (e.g., error tracking service)
    if (level === 'error' || level === 'critical') {
      this.handleCriticalError(entry);
    }
  }

  private logToConsole(entry: ErrorLogEntry) {
    const { level, message, error, metadata, context } = entry;
    
    const logStyle = this.getLogStyle(level);
    
    console.group(`[${level.toUpperCase()}] ${message}`);
    console.log('%cTimestamp:', logStyle, entry.timestamp);
    if (context) console.log('%cContext:', logStyle, context);
    if (metadata) console.log('%cMetadata:', logStyle, metadata);
    if (error) console.log('%cError:', logStyle, error);
    console.groupEnd();
  }

  private getLogStyle(level: LogLevel): string {
    switch (level) {
      case 'critical':
        return 'color: #ff0000; font-weight: bold';
      case 'error':
        return 'color: #ff4444';
      case 'warning':
        return 'color: #ffaa00';
      default:
        return 'color: #666666';
    }
  }

  private handleCriticalError(entry: ErrorLogEntry) {
    // Here you could implement additional error handling for critical errors
    // For example, sending to an error tracking service or displaying a modal
    console.error('Critical error occurred:', entry);
  }
}

export const errorLogger = ErrorLogger.getInstance();

/**
 * Logging Service with Observer Pattern
 * Centralizes logging and allows multiple observers (console, file, external)
 */

export interface LogEntry {
  level: "debug" | "info" | "warn" | "error";
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  source?: string;
}

export interface LogObserver {
  notify(entry: LogEntry): void | Promise<void>;
}

/**
 * Console log observer
 */
class ConsoleObserver implements LogObserver {
  notify(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;
    const message = entry.source ? `${prefix} [${entry.source}] ${entry.message}` : `${prefix} ${entry.message}`;
    
    switch (entry.level) {
      case "debug":
        console.debug(message, entry.metadata || "");
        break;
      case "info":
        console.info(message, entry.metadata || "");
        break;
      case "warn":
        console.warn(message, entry.metadata || "");
        break;
      case "error":
        console.error(message, entry.metadata || "");
        break;
    }
  }
}

/**
 * File log observer (for production)
 */
class FileObserver implements LogObserver {
  private logBuffer: LogEntry[] = [];
  private flushInterval: NodeJS.Timeout;

  constructor(private maxBufferSize = 100, private flushIntervalMs = 5000) {
    // Flush logs periodically
    this.flushInterval = setInterval(() => this.flush(), flushIntervalMs);
  }

  notify(entry: LogEntry): void {
    this.logBuffer.push(entry);
    
    if (this.logBuffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    try {
      // In a real implementation, you'd write to a file or send to a service
      // For now, we'll just clear the buffer
      const logs = this.logBuffer.splice(0);
      
      // Could implement file writing here:
      // await fs.writeFile('logs/app.log', logs.map(log => JSON.stringify(log)).join('\n'), { flag: 'a' });
      
      console.debug(`Flushed ${logs.length} log entries`);
    } catch (error) {
      console.error("Failed to flush logs:", error);
    }
  }

  destroy(): void {
    this.flush();
    clearInterval(this.flushInterval);
  }
}

/**
 * Main logging service implementing Observer pattern
 */
class LoggingService {
  private observers: LogObserver[] = [];
  private static instance: LoggingService;

  private constructor() {
    // Add default observers
    this.addObserver(new ConsoleObserver());
    
    // Add file observer in production
    if (process.env.NODE_ENV === "production") {
      this.addObserver(new FileObserver());
    }
  }

  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  addObserver(observer: LogObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: LogObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  private log(level: LogEntry["level"], message: string, metadata?: Record<string, any>, source?: string): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      metadata,
      source,
    };

    // Notify all observers
    this.observers.forEach(observer => {
      try {
        observer.notify(entry);
      } catch (error) {
        console.error("Observer notification failed:", error);
      }
    });
  }

  debug(message: string, metadata?: Record<string, any>, source?: string): void {
    this.log("debug", message, metadata, source);
  }

  info(message: string, metadata?: Record<string, any>, source?: string): void {
    this.log("info", message, metadata, source);
  }

  warn(message: string, metadata?: Record<string, any>, source?: string): void {
    this.log("warn", message, metadata, source);
  }

  error(message: string, metadata?: Record<string, any>, source?: string): void {
    this.log("error", message, metadata, source);
  }

  // Convenience methods for common patterns
  logApiRequest(method: string, path: string, userId?: string, metadata?: Record<string, any>): void {
    this.info(`${method} ${path}`, { userId, ...metadata }, "API");
  }

  logApiError(method: string, path: string, error: Error, userId?: string): void {
    this.error(`${method} ${path} failed`, { 
      error: error.message, 
      stack: error.stack, 
      userId 
    }, "API");
  }

  logAuthEvent(event: string, userId?: string, metadata?: Record<string, any>): void {
    this.info(`Auth: ${event}`, { userId, ...metadata }, "AUTH");
  }

  logBusinessEvent(event: string, metadata?: Record<string, any>): void {
    this.info(`Business: ${event}`, metadata, "BUSINESS");
  }
}

// Export singleton instance
export const logger = LoggingService.getInstance();
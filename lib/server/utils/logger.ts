type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  meta?: Record<string, any>;
}

/**
 * Structured logging utility
 * Logs are formatted as JSON for easy parsing
 */
export const logger = {
  /**
   * Log info level message
   */
  info(context: string, message: string, meta?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "info",
      context,
      message,
      ...(meta && { meta }),
    };
    console.log(JSON.stringify(entry));
  },

  /**
   * Log warning level message
   */
  warn(context: string, message: string, meta?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "warn",
      context,
      message,
      ...(meta && { meta }),
    };
    console.warn(JSON.stringify(entry));
  },

  /**
   * Log error level message
   */
  error(context: string, message: string, meta?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "error",
      context,
      message,
      ...(meta && { meta }),
    };
    console.error(JSON.stringify(entry));
  },

  /**
   * Log debug level message
   */
  debug(context: string, message: string, meta?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "debug",
      context,
      message,
      ...(meta && { meta }),
    };
    console.debug(JSON.stringify(entry));
  },

  /**
   * Log API request
   */
  apiRequest(method: string, path: string, meta?: Record<string, any>) {
    this.info("API", `${method} ${path}`, meta);
  },

  /**
   * Log successful API response
   */
  apiSuccess(method: string, path: string, meta?: Record<string, any>) {
    this.info("API_SUCCESS", `${method} ${path}`, meta);
  },

  /**
   * Log API error
   */
  apiError(method: string, path: string, error: any, meta?: Record<string, any>) {
    const errorMeta = {
      error: error instanceof Error ? error.message : String(error),
      ...meta,
    };
    this.error("API_ERROR", `${method} ${path}`, errorMeta);
  },

  /**
   * Log database operation
   */
  db(operation: string, table: string, meta?: Record<string, any>) {
    this.debug("DATABASE", `${operation} on ${table}`, meta);
  },

  /**
   * Log authentication event
   */
  auth(event: string, meta?: Record<string, any>) {
    this.info("AUTH", event, meta);
  },
};

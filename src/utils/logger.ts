class Logger {
  constructor(private context: string) {}

  info(message: string): void {
    console.log(`[${this.context}] ℹ️ ${message}`);
  }

  success(message: string): void {
    console.log(`[${this.context}] ✅ ${message}`);
  }

  warn(message: string): void {
    console.warn(`[${this.context}] ⚠️ ${message}`);
  }

  error(message: string, error?: unknown): void {
    console.error(`[${this.context}] ❌ ${message}`);
    if (error) {
      console.error(error);
    }
  }

  debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[${this.context}] 🔍 ${message}`);
      if (data) {
        console.debug(data);
      }
    }
  }
}

export { Logger };

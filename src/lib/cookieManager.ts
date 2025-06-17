// Centralized cookie management for Robot Framework Test Manager

export interface TestRunData {
  file: any;
  outputDir: string;
  timestamp: string;
  results?: any;
}

export interface UserPreferences {
  theme: "light" | "dark" | "green";
  terminalHistory: any[];
  selectedFiles: string[];
  outputDirectory: string;
  lastTestRun?: TestRunData;
}

class CookieManager {
  private static instance: CookieManager;

  private constructor() {}

  public static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager();
    }
    return CookieManager.instance;
  }

  // Enhanced cookie utility functions
  private setCookie(name: string, value: string, days: number = 30): void {
    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `rf-${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    } catch (error) {
      console.error(`Error setting cookie ${name}:`, error);
    }
  }

  private getCookie(name: string): string | null {
    try {
      const nameEQ = `rf-${name}=`;
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
      }
      return null;
    } catch (error) {
      console.error(`Error getting cookie ${name}:`, error);
      return null;
    }
  }

  private deleteCookie(name: string): void {
    document.cookie = `rf-${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Theme management
  public saveTheme(theme: "light" | "dark" | "green"): void {
    this.setCookie("theme", theme, 365);
  }

  public getTheme(): "light" | "dark" | "green" {
    const theme = this.getCookie("theme");
    return (theme as "light" | "dark" | "green") || "light";
  }

  // Terminal history management
  public saveTerminalHistory(history: any[]): void {
    const limitedHistory = history.slice(-50); // Keep only last 50 entries
    this.setCookie("terminal-history", JSON.stringify(limitedHistory), 7);
  }

  public getTerminalHistory(): any[] {
    const history = this.getCookie("terminal-history");
    if (history) {
      try {
        return JSON.parse(history);
      } catch (e) {
        console.error("Failed to parse terminal history:", e);
      }
    }
    return [];
  }

  // Command history management
  public saveCommandHistory(commands: any[]): void {
    const limitedCommands = commands.slice(-20); // Keep only last 20 commands
    this.setCookie("command-history", JSON.stringify(limitedCommands), 30);
  }

  public getCommandHistory(): any[] {
    const commands = this.getCookie("command-history");
    if (commands) {
      try {
        return JSON.parse(commands);
      } catch (e) {
        console.error("Failed to parse command history:", e);
      }
    }
    return [];
  }

  // File management
  public saveSelectedFile(file: any): void {
    this.setCookie("selected-file", JSON.stringify(file), 7);
  }

  public getSelectedFile(): any | null {
    const file = this.getCookie("selected-file");
    if (file) {
      try {
        return JSON.parse(file);
      } catch (e) {
        console.error("Failed to parse selected file:", e);
      }
    }
    return null;
  }

  public saveUploadedFiles(fileNames: string[]): void {
    this.setCookie("uploaded-files", JSON.stringify(fileNames), 30);
  }

  public getUploadedFiles(): string[] {
    const files = this.getCookie("uploaded-files");
    if (files) {
      try {
        return JSON.parse(files);
      } catch (e) {
        console.error("Failed to parse uploaded files:", e);
      }
    }
    return [];
  }

  // Output directory management
  public saveOutputDirectory(dir: string): void {
    this.setCookie("output-directory", dir, 30);
  }

  public getOutputDirectory(): string | null {
    return this.getCookie("output-directory");
  }

  // Test run management
  public saveTestRun(testRun: TestRunData): void {
    this.setCookie("current-test-run", JSON.stringify(testRun), 1);
  }

  public getCurrentTestRun(): TestRunData | null {
    const testRun = this.getCookie("current-test-run");
    if (testRun) {
      try {
        return JSON.parse(testRun);
      } catch (e) {
        console.error("Failed to parse test run:", e);
      }
    }
    return null;
  }

  public saveTestResults(results: any): void {
    this.setCookie("last-test-results", JSON.stringify(results), 30);
  }

  public getLastTestResults(): any | null {
    const results = this.getCookie("last-test-results");
    if (results) {
      try {
        return JSON.parse(results);
      } catch (e) {
        console.error("Failed to parse test results:", e);
      }
    }
    return null;
  }

  // User preferences management
  public saveUserPreferences(preferences: Partial<UserPreferences>): void {
    const current = this.getUserPreferences();
    const updated = { ...current, ...preferences };
    this.setCookie("user-preferences", JSON.stringify(updated), 365);
  }

  public getUserPreferences(): UserPreferences {
    const prefs = this.getCookie("user-preferences");
    const defaultPrefs: UserPreferences = {
      theme: "light",
      terminalHistory: [],
      selectedFiles: [],
      outputDirectory: "/output",
    };

    if (prefs) {
      try {
        return { ...defaultPrefs, ...JSON.parse(prefs) };
      } catch (e) {
        console.error("Failed to parse user preferences:", e);
      }
    }
    return defaultPrefs;
  }

  // Clear all Robot Framework related cookies
  public clearAllData(): void {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name.startsWith("rf-")) {
        this.deleteCookie(name.substring(3)); // Remove 'rf-' prefix
      }
    });
  }

  // Export all data for backup
  public exportAllData(): string {
    const data = {
      theme: this.getTheme(),
      terminalHistory: this.getTerminalHistory(),
      commandHistory: this.getCommandHistory(),
      selectedFile: this.getSelectedFile(),
      uploadedFiles: this.getUploadedFiles(),
      outputDirectory: this.getOutputDirectory(),
      currentTestRun: this.getCurrentTestRun(),
      lastTestResults: this.getLastTestResults(),
      userPreferences: this.getUserPreferences(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  // Import data from backup
  public importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.theme) this.saveTheme(data.theme);
      if (data.terminalHistory) this.saveTerminalHistory(data.terminalHistory);
      if (data.commandHistory) this.saveCommandHistory(data.commandHistory);
      if (data.selectedFile) this.saveSelectedFile(data.selectedFile);
      if (data.uploadedFiles) this.saveUploadedFiles(data.uploadedFiles);
      if (data.outputDirectory) this.saveOutputDirectory(data.outputDirectory);
      if (data.currentTestRun) this.saveTestRun(data.currentTestRun);
      if (data.lastTestResults) this.saveTestResults(data.lastTestResults);
      if (data.userPreferences) this.saveUserPreferences(data.userPreferences);

      return true;
    } catch (error) {
      console.error("Failed to import data:", error);
      return false;
    }
  }
}

export default CookieManager;

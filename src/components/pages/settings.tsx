import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings as SettingsIcon,
  Save,
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  Zap,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import CookieManager from "../../lib/cookieManager";

interface SettingsData {
  theme: "light" | "dark" | "green";
  outputDirectory: string;
  terminalHistoryLimit: number;
  commandHistoryLimit: number;
  autoRefreshInterval: number;
  enableNotifications: boolean;
  defaultTestTimeout: number;
  maxConcurrentTests: number;
}

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const cookieManager = CookieManager.getInstance();

  const [settings, setSettings] = useState<SettingsData>({
    theme: "light",
    outputDirectory: "/output",
    terminalHistoryLimit: 50,
    commandHistoryLimit: 20,
    autoRefreshInterval: 5000,
    enableNotifications: true,
    defaultTestTimeout: 300,
    maxConcurrentTests: 3,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    // Load settings from localStorage and cookies
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      // Load from localStorage first
      const savedSettings = localStorage.getItem("rf-settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }

      // Load specific values from cookies
      const outputDir = cookieManager.getOutputDirectory();
      if (outputDir) {
        setSettings((prev) => ({ ...prev, outputDirectory: outputDir }));
      }

      const currentTheme = cookieManager.getTheme();
      setSettings((prev) => ({ ...prev, theme: currentTheme }));
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem("rf-settings", JSON.stringify(settings));

      // Save specific values to cookies
      cookieManager.saveTheme(settings.theme);
      cookieManager.saveOutputDirectory(settings.outputDirectory);

      // Apply theme change
      setTheme(settings.theme);

      setLastSaved(new Date());

      // Show success feedback
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    const defaultSettings: SettingsData = {
      theme: "light",
      outputDirectory: "/output",
      terminalHistoryLimit: 50,
      commandHistoryLimit: 20,
      autoRefreshInterval: 5000,
      enableNotifications: true,
      defaultTestTimeout: 300,
      maxConcurrentTests: 3,
    };
    setSettings(defaultSettings);
  };

  const exportSettings = () => {
    const dataToExport = {
      settings,
      allData: JSON.parse(cookieManager.exportAllData()),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rf-settings-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) {
          setSettings(data.settings);
        }
        if (data.allData) {
          cookieManager.importData(JSON.stringify(data.allData));
        }
        alert("Settings imported successfully!");
      } catch (error) {
        console.error("Failed to import settings:", error);
        alert("Failed to import settings. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone.",
      )
    ) {
      cookieManager.clearAllData();
      localStorage.removeItem("rf-settings");
      resetSettings();
      alert("All data cleared successfully!");
    }
  };

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "green":
        return <Zap className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <SettingsIcon className="h-6 w-6" />
                Settings
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-sm text-muted-foreground">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <Button
                onClick={saveSettings}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Theme Settings */}
          <Card className="bg-background border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getThemeIcon(settings.theme)}
                Theme Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Application Theme
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {getThemeIcon(settings.theme)}
                        {settings.theme.charAt(0).toUpperCase() +
                          settings.theme.slice(1)}{" "}
                        Mode
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, theme: "light" }))
                      }
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light Mode
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, theme: "dark" }))
                      }
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark Mode
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, theme: "green" }))
                      }
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Green Mode
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Test Execution Settings */}
          <Card className="bg-background border">
            <CardHeader>
              <CardTitle>Test Execution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Default Output Directory
                </label>
                <Input
                  value={settings.outputDirectory}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      outputDirectory: e.target.value,
                    }))
                  }
                  placeholder="/output"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Default Test Timeout (seconds)
                </label>
                <Input
                  type="number"
                  value={settings.defaultTestTimeout}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultTestTimeout: parseInt(e.target.value) || 300,
                    }))
                  }
                  min="30"
                  max="3600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Max Concurrent Tests
                </label>
                <Input
                  type="number"
                  value={settings.maxConcurrentTests}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      maxConcurrentTests: parseInt(e.target.value) || 3,
                    }))
                  }
                  min="1"
                  max="10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Terminal Settings */}
          <Card className="bg-background border">
            <CardHeader>
              <CardTitle>Terminal & History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Terminal History Limit
                </label>
                <Input
                  type="number"
                  value={settings.terminalHistoryLimit}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      terminalHistoryLimit: parseInt(e.target.value) || 50,
                    }))
                  }
                  min="10"
                  max="200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Command History Limit
                </label>
                <Input
                  type="number"
                  value={settings.commandHistoryLimit}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      commandHistoryLimit: parseInt(e.target.value) || 20,
                    }))
                  }
                  min="5"
                  max="100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Auto Refresh Interval (ms)
                </label>
                <Input
                  type="number"
                  value={settings.autoRefreshInterval}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      autoRefreshInterval: parseInt(e.target.value) || 5000,
                    }))
                  }
                  min="1000"
                  max="60000"
                  step="1000"
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-background border">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={exportSettings}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("import-file")?.click()
                  }
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={resetSettings}
                className="w-full flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button
                variant="destructive"
                onClick={clearAllData}
                className="w-full flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={importSettings}
                style={{ display: "none" }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Current Settings Summary */}
        <Card className="mt-8 bg-background border">
          <CardHeader>
            <CardTitle>Current Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              <pre className="text-sm text-muted-foreground">
                {JSON.stringify(settings, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

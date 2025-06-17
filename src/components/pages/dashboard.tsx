import React, { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import TestDashboard from "../test-management/TestDashboard";
import Terminal from "../test-management/Terminal";
import FileBrowser from "../test-management/FileBrowser";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "../../hooks/useTheme";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const { theme } = useTheme();

  // Function to trigger loading state for demonstration
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleCommandExecute = (command: string) => {
    console.log("Executing command:", command);
    // Save command history to cookies
    const history = getCookie("rf-command-history");
    const commandHistory = history ? JSON.parse(history) : [];
    commandHistory.push({ command, timestamp: new Date().toISOString() });
    // Keep only last 20 commands
    const recentHistory = commandHistory.slice(-20);
    setCookie("rf-command-history", JSON.stringify(recentHistory), 30);
  };

  const handleFileSelect = (file: any) => {
    console.log("File selected:", file);
    setCookie("rf-selected-file", JSON.stringify(file), 7);
  };

  const handleTestRun = (file: any, outputDir?: string) => {
    console.log("Running test:", file, "Output dir:", outputDir);
    setShowTerminal(true);

    // Save test run info to cookies
    const testRunInfo = {
      file: file,
      outputDir: outputDir,
      timestamp: new Date().toISOString(),
    };
    setCookie("rf-current-test-run", JSON.stringify(testRunInfo), 1);
  };

  const handleOutputDirSelect = (dir: string) => {
    console.log("Output directory selected:", dir);
    setCookie("rf-output-directory", dir, 30);
  };

  const handleTestComplete = (results: any) => {
    console.log("Test completed:", results);
    // Update dashboard with new results
    setCookie("rf-last-test-results", JSON.stringify(results), 30);
  };

  const handleExportResults = () => {
    console.log("Exporting results to Excel...");
    // Simulate Excel export
    const link = document.createElement("a");
    link.href =
      "data:text/csv;charset=utf-8,Test Name,Status,Duration,Pass Rate\nLogin Tests,Passed,45s,100%\nAPI Tests,Failed,1m 23s,85%";
    link.download = "test-results.csv";
    link.click();
  };

  const handleOpenReports = () => {
    console.log("Opening HTML reports...");
    // Simulate opening HTML report
    window.open(
      "data:text/html,<html><body><h1>Robot Framework Test Report</h1><p>Test execution completed successfully.</p></body></html>",
      "_blank",
    );
  };

  return (
    <div
      className={`min-h-screen bg-background transition-colors duration-300`}
    >
      <TopNavigation
        onTerminalToggle={() => setShowTerminal(!showTerminal)}
        onFileBrowserToggle={() => setShowFileBrowser(!showFileBrowser)}
        onDashboardView={() => {
          setShowTerminal(false);
          setShowFileBrowser(false);
        }}
        onExportResults={handleExportResults}
        onOpenReports={handleOpenReports}
      />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <main className="flex-1 overflow-auto">
          <div
            className={cn(
              "container mx-auto p-6 space-y-6",
              "transition-all duration-300 ease-in-out",
            )}
          >
            <TestDashboard
              onRefresh={handleRefresh}
              onExportResults={handleExportResults}
              onOpenReport={(runId) => {
                console.log("Opening report for run:", runId);
                handleOpenReports();
              }}
            />
          </div>
        </main>

        {/* Side Panels */}
        {(showTerminal || showFileBrowser) && (
          <div className="w-[480px] border-l bg-background/95 backdrop-blur-sm">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">
                  {showTerminal && showFileBrowser
                    ? "Tools"
                    : showTerminal
                      ? "Terminal"
                      : "File Browser"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowTerminal(false);
                    setShowFileBrowser(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {showTerminal && showFileBrowser ? (
                  <div className="space-y-4">
                    <FileBrowser
                      onFileSelect={handleFileSelect}
                      onTestRun={handleTestRun}
                      onOutputDirSelect={handleOutputDirSelect}
                      className="h-64"
                    />
                    <Terminal
                      onCommandExecute={handleCommandExecute}
                      onTestComplete={handleTestComplete}
                      className="h-64"
                    />
                  </div>
                ) : showFileBrowser ? (
                  <FileBrowser
                    onFileSelect={handleFileSelect}
                    onTestRun={handleTestRun}
                    onOutputDirSelect={handleOutputDirSelect}
                    className="h-full"
                  />
                ) : (
                  <Terminal
                    onCommandExecute={handleCommandExecute}
                    onTestComplete={handleTestComplete}
                    className="h-full"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Cookie utility functions
function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export default Home;

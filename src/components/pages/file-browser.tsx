import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import FileBrowser from "../test-management/FileBrowser";
import Terminal from "../test-management/Terminal";
import CookieManager from "../../lib/cookieManager";

const FileBrowserPage = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const cookieManager = CookieManager.getInstance();

  const handleFileSelect = (file: any) => {
    console.log("File selected:", file);
    cookieManager.saveSelectedFile(file);
  };

  const handleTestRun = (file: any, outputDir?: string) => {
    console.log("Running test:", file, "Output dir:", outputDir);

    // Save test run info to cookies
    const testRunInfo = {
      file: file,
      outputDir: outputDir,
      timestamp: new Date().toISOString(),
    };
    cookieManager.saveTestRun(testRunInfo);
  };

  const handleOutputDirSelect = (dir: string) => {
    console.log("Output directory selected:", dir);
    cookieManager.saveOutputDirectory(dir);
  };

  const handleCommandExecute = (command: string) => {
    console.log("Executing command:", command);
    // Save command history to cookies
    const history = cookieManager.getCommandHistory();
    const newHistory = [
      ...history,
      { command, timestamp: new Date().toISOString() },
    ];
    cookieManager.saveCommandHistory(newHistory);
  };

  const handleTestComplete = (results: any) => {
    console.log("Test completed:", results);
    // Save test results and suite execution
    cookieManager.saveTestResults(results);

    // Save suite execution with timestamp
    const suiteExecution = {
      ...results,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: "suite_execution",
    };

    // Get existing suite executions and add new one
    const existingExecutions = cookieManager.getTerminalHistory();
    const updatedExecutions = [...existingExecutions, suiteExecution].slice(
      -20,
    ); // Keep last 20
    cookieManager.saveTerminalHistory(updatedExecutions);
  };

  const handleFilesUploaded = (files: string[]) => {
    setUploadedFiles(files);
    // Save uploaded files to cookies so terminal can see them
    cookieManager.saveUploadedFiles(files);
  };

  const handleClearResults = async () => {
    setIsClearing(true);
    try {
      // Clear file-related data
      cookieManager.saveSelectedFile(null);
      cookieManager.saveUploadedFiles([]);
      cookieManager.saveTestRun(null);
      setUploadedFiles([]);

      // Force page refresh to clear file browser state
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Failed to clear results:", error);
    } finally {
      setTimeout(() => setIsClearing(false), 1000);
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
              <h1 className="text-2xl font-semibold text-foreground">
                File Browser & Terminal
              </h1>
            </div>
            <Button
              onClick={handleClearResults}
              disabled={isClearing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isClearing ? "Clearing..." : "Clear Files"}
            </Button>
          </div>
        </div>
      </div>

      {/* Combined Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="h-[calc(100vh-200px)] flex gap-6">
          {/* File Browser - Left Side */}
          <div className="w-1/2">
            <FileBrowser
              onFileSelect={handleFileSelect}
              onTestRun={handleTestRun}
              onOutputDirSelect={handleOutputDirSelect}
              onFilesUploaded={handleFilesUploaded}
              className="h-full"
            />
          </div>

          {/* Terminal - Right Side */}
          <div className="w-1/2">
            <Terminal
              onCommandExecute={handleCommandExecute}
              onTestComplete={handleTestComplete}
              uploadedFiles={uploadedFiles}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileBrowserPage;

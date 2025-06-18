import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import FileBrowser from "../test-management/FileBrowser";
import CookieManager from "../../lib/cookieManager";

const FileBrowserPage = () => {
  const [isClearing, setIsClearing] = useState(false);
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

    // Navigate to terminal to show execution
    window.location.href = "/terminal";
  };

  const handleOutputDirSelect = (dir: string) => {
    console.log("Output directory selected:", dir);
    cookieManager.saveOutputDirectory(dir);
  };

  const handleClearResults = async () => {
    setIsClearing(true);
    try {
      // Clear file-related data
      cookieManager.saveSelectedFile(null);
      cookieManager.saveUploadedFiles([]);
      cookieManager.saveTestRun(null);

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
                File Browser
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

      {/* File Browser Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="h-[calc(100vh-200px)]">
          <FileBrowser
            onFileSelect={handleFileSelect}
            onTestRun={handleTestRun}
            onOutputDirSelect={handleOutputDirSelect}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default FileBrowserPage;

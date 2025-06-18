import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Terminal from "../test-management/Terminal";
import CookieManager from "../../lib/cookieManager";

const TerminalPage = () => {
  const [isClearing, setIsClearing] = useState(false);
  const cookieManager = CookieManager.getInstance();

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

  const handleClearResults = async () => {
    setIsClearing(true);
    try {
      // Clear test results and terminal history
      cookieManager.saveTestResults(null);
      cookieManager.saveTerminalHistory([]);
      cookieManager.saveCommandHistory([]);

      // Force terminal to refresh by reloading the page
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
                Terminal
              </h1>
            </div>
            <Button
              onClick={handleClearResults}
              disabled={isClearing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isClearing ? "Clearing..." : "Clear Results"}
            </Button>
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="h-[calc(100vh-200px)]">
          <Terminal
            onCommandExecute={handleCommandExecute}
            onTestComplete={handleTestComplete}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalPage;

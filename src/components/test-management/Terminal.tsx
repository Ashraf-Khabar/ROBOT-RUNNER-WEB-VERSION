import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal as TerminalIcon, Play, Square, Trash2 } from "lucide-react";

interface TerminalOutput {
  id: string;
  text: string;
  type: "command" | "output" | "error";
  timestamp: Date;
}

interface TerminalProps {
  onCommandExecute?: (command: string) => void;
  onTestComplete?: (results: any) => void;
  uploadedFiles?: string[];
  className?: string;
}

const Terminal = ({
  onCommandExecute = () => {},
  onTestComplete = () => {},
  uploadedFiles = [],
  className = "",
}: TerminalProps) => {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<TerminalOutput[]>(() => {
    // Load previous session from cookies
    const savedOutput = getCookie("rf-terminal-history");
    if (savedOutput) {
      try {
        const parsed = JSON.parse(savedOutput);
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      } catch (e) {
        console.error("Failed to parse terminal history:", e);
      }
    }
    return [
      {
        id: "1",
        text: "Robot Framework Test Terminal - Ready",
        type: "output",
        timestamp: new Date(),
      },
      {
        id: "2",
        text: "Type 'robot --help' for Robot Framework commands or upload .robot files",
        type: "output",
        timestamp: new Date(),
      },
    ];
  });
  const [isRunning, setIsRunning] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new output is added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [output]);

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    const newOutput: TerminalOutput = {
      id: Date.now().toString(),
      text: `$ ${cmd}`,
      type: "command",
      timestamp: new Date(),
    };

    setOutput((prev) => {
      const updated = [...prev, newOutput];
      // Save to cookies (keep last 50 entries)
      const toSave = updated.slice(-50);
      setCookie("rf-terminal-history", JSON.stringify(toSave), 7);
      return updated;
    });
    setIsRunning(true);
    onCommandExecute(cmd);

    // Enhanced command execution simulation
    setTimeout(
      () => {
        const resultOutput: TerminalOutput = {
          id: (Date.now() + 1).toString(),
          text: simulateCommandOutput(cmd),
          type:
            cmd.includes("robot") &&
            !cmd.includes("--help") &&
            !cmd.includes("--version")
              ? "output"
              : "output",
          timestamp: new Date(),
        };

        setOutput((prev) => {
          const updated = [...prev, resultOutput];
          // Save to cookies
          const toSave = updated.slice(-50);
          setCookie("rf-terminal-history", JSON.stringify(toSave), 7);
          return updated;
        });

        // If it's a robot test command, trigger test completion callback
        if (
          cmd.includes("robot") &&
          !cmd.includes("--help") &&
          !cmd.includes("--version")
        ) {
          const testResults = {
            command: cmd,
            timestamp: new Date(),
            success: Math.random() > 0.3, // 70% success rate simulation
            duration: `${Math.floor(Math.random() * 180 + 30)}s`,
            testsRun: Math.floor(Math.random() * 10 + 1),
            testsPassed: Math.floor(Math.random() * 8 + 1),
            testsFailed: Math.floor(Math.random() * 3),
          };
          onTestComplete(testResults);
          setCookie("rf-last-test-results", JSON.stringify(testResults), 30);
        }

        setIsRunning(false);
      },
      1000 + Math.random() * 3000,
    );

    setCommand("");
  };

  const simulateCommandOutput = (cmd: string): string => {
    if (cmd.includes("robot --version")) {
      return "Robot Framework 6.1.1 (Python 3.11.0 on linux)\nSelenium Library 6.2.0\nRequests Library 0.9.7";
    }
    if (cmd.includes("robot --help")) {
      return `Robot Framework -- A generic automation framework\n\nUsage:  robot [options] data_sources\n\nOptions:\n  -d --outputdir dir       Where to create output files. Default is '.'.\n  -o --output file         XML output file. Default is 'output.xml'.\n  -l --log file           HTML log file. Default is 'log.html'.\n  -r --report file        HTML report file. Default is 'report.html'.\n  -v --variable name:value Set variables from command line.\n  -t --test name          Select tests by name.\n  -s --suite name         Select suites by name.\n  --help                  Show this help.`;
    }
    if (cmd.includes("robot") && cmd.includes(".robot")) {
      const testFile = cmd.match(/([\w-]+\.robot)/)?.[1] || "test.robot";
      const outputDir = cmd.includes("-d")
        ? cmd.split("-d")[1]?.trim().split(" ")[0] || "./output"
        : "./output";
      const success = Math.random() > 0.2; // 80% success rate
      const testsRun = Math.floor(Math.random() * 8 + 2);
      const testsPassed = success ? testsRun : Math.floor(testsRun * 0.7);
      const testsFailed = testsRun - testsPassed;

      return `==============================================================================\n${testFile.replace(".robot", "")} Test Suite\n==============================================================================\n${Array.from(
        { length: testsRun },
        (_, i) =>
          `Test Case ${i + 1}                                                    | ${i < testsPassed ? "PASS" : "FAIL"} |`,
      ).join(
        "\n",
      )}\n------------------------------------------------------------------------------\n${testFile.replace(".robot", "")} Test Suite                                    | ${success ? "PASS" : "FAIL"} |\n${testsRun} tests, ${testsPassed} passed, ${testsFailed} failed\n==============================================================================\nOutput:  ${outputDir}/output.xml\nLog:     ${outputDir}/log.html\nReport:  ${outputDir}/report.html`;
    }
    if (cmd.includes("pip install robotframework")) {
      return "Collecting robotframework\nDownloading robotframework-6.1.1-py3-none-any.whl (678 kB)\nInstalling collected packages: robotframework\nSuccessfully installed robotframework-6.1.1";
    }
    if (cmd.includes("pip list") || cmd.includes("pip show")) {
      return "robotframework==6.1.1\nseleniumlibrary==6.2.0\nrequests==2.31.0\nrequestslibrary==0.9.7";
    }
    if (cmd.includes("ls") || cmd.includes("dir")) {
      let baseFiles =
        "test_suites/\n  login_tests.robot\n  api_tests.robot\n  ui_tests.robot\nresources/\n  keywords.robot\n  variables.robot\noutput/\n  output.xml\n  log.html\n  report.html";

      // Add uploaded files if any
      const savedUploadedFiles = getCookie("rf-uploaded-files");
      const uploadedFilesList = savedUploadedFiles
        ? JSON.parse(savedUploadedFiles)
        : uploadedFiles;

      if (uploadedFilesList && uploadedFilesList.length > 0) {
        baseFiles += "\nuploaded_tests/";
        uploadedFilesList.forEach((file: string) => {
          baseFiles += `\n  ${file}`;
        });
      }

      return baseFiles;
    }
    if (cmd.includes("python --version") || cmd.includes("python3 --version")) {
      return "Python 3.11.0";
    }
    return `Command executed: ${cmd}\nResult: Command completed successfully`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(command);
    }
  };

  const clearTerminal = () => {
    const clearedOutput = [
      {
        id: Date.now().toString(),
        text: "Terminal cleared - Robot Framework Test Terminal Ready",
        type: "output",
        timestamp: new Date(),
      },
    ];
    setOutput(clearedOutput);
    // Clear terminal history from cookies
    setCookie("rf-terminal-history", JSON.stringify(clearedOutput), 7);
  };

  const stopExecution = () => {
    setIsRunning(false);
    const stopOutput: TerminalOutput = {
      id: Date.now().toString(),
      text: "Process terminated by user",
      type: "error",
      timestamp: new Date(),
    };
    setOutput((prev) => [...prev, stopOutput]);
  };

  return (
    <Card className={`bg-black text-green-400 font-mono ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-green-400">
            <TerminalIcon className="h-5 w-5" />
            Integrated Terminal
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={clearTerminal}
              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {isRunning && (
              <Button
                size="sm"
                variant="outline"
                onClick={stopExecution}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Square className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent
        className="p-0 flex flex-col"
        style={{
          height: className.includes("h-") ? "calc(100% - 80px)" : "auto",
        }}
      >
        <ScrollArea
          className={`${className.includes("h-") ? "flex-1" : "h-80"} px-4`}
          ref={scrollAreaRef}
        >
          <div className="space-y-1 pb-4">
            {output.map((line) => (
              <div key={line.id} className="flex items-start gap-2">
                <span className="text-green-600 text-xs mt-1 flex-shrink-0">
                  {line.timestamp.toLocaleTimeString()}
                </span>
                <pre
                  className={`text-sm whitespace-pre-wrap flex-1 break-words ${
                    line.type === "command"
                      ? "text-yellow-400 font-bold"
                      : line.type === "error"
                        ? "text-red-400"
                        : "text-green-300"
                  }`}
                >
                  {line.text}
                </pre>
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-2 text-green-400">
                <div className="animate-spin h-4 w-4 border-2 border-green-400 border-t-transparent rounded-full"></div>
                <span className="text-sm">Executing...</span>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t border-green-500/30 p-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-green-400 flex-shrink-0">$</span>
            <Input
              ref={inputRef}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Robot Framework commands..."
              className="bg-transparent border-green-500/30 text-green-400 placeholder-green-600 focus:border-green-400 flex-1 min-w-0"
              disabled={isRunning}
            />
            <Button
              size="sm"
              onClick={() => executeCommand(command)}
              disabled={isRunning || !command.trim()}
              className="bg-green-600 hover:bg-green-700 text-black flex-shrink-0"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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

export default Terminal;

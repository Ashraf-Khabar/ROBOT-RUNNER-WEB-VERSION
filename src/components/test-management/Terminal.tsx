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
  className?: string;
}

const Terminal = ({
  onCommandExecute = () => {},
  className = "",
}: TerminalProps) => {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<TerminalOutput[]>([
    {
      id: "1",
      text: "Robot Framework Test Terminal - Ready",
      type: "output",
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "Type 'robot --help' for Robot Framework commands",
      type: "output",
      timestamp: new Date(),
    },
  ]);
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

    setOutput((prev) => [...prev, newOutput]);
    setIsRunning(true);
    onCommandExecute(cmd);

    // Simulate command execution
    setTimeout(
      () => {
        const resultOutput: TerminalOutput = {
          id: (Date.now() + 1).toString(),
          text: simulateCommandOutput(cmd),
          type: cmd.includes("robot") ? "output" : "output",
          timestamp: new Date(),
        };
        setOutput((prev) => [...prev, resultOutput]);
        setIsRunning(false);
      },
      1000 + Math.random() * 2000,
    );

    setCommand("");
  };

  const simulateCommandOutput = (cmd: string): string => {
    if (cmd.includes("robot --version") || cmd.includes("robot --help")) {
      return "Robot Framework 6.1.1 (Python 3.11.0 on win32)";
    }
    if (cmd.includes("robot")) {
      return `==============================================================================\nTest Suite Name\n==============================================================================\nTest Case 1                                                           | PASS |\n------------------------------------------------------------------------------\nTest Suite Name                                                       | PASS |\n1 test, 1 passed, 0 failed\n==============================================================================\nOutput:  output.xml\nLog:     log.html\nReport:  report.html`;
    }
    if (cmd.includes("pip install robotframework")) {
      return "Successfully installed robotframework-6.1.1";
    }
    if (cmd.includes("ls") || cmd.includes("dir")) {
      return "test_suite.robot\noutput.xml\nlog.html\nreport.html";
    }
    return `Command executed: ${cmd}`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(command);
    }
  };

  const clearTerminal = () => {
    setOutput([
      {
        id: Date.now().toString(),
        text: "Terminal cleared",
        type: "output",
        timestamp: new Date(),
      },
    ]);
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
      <CardContent className="p-0">
        <ScrollArea className="h-80 px-4" ref={scrollAreaRef}>
          <div className="space-y-1 pb-4">
            {output.map((line) => (
              <div key={line.id} className="flex items-start gap-2">
                <span className="text-green-600 text-xs mt-1">
                  {line.timestamp.toLocaleTimeString()}
                </span>
                <pre
                  className={`text-sm whitespace-pre-wrap flex-1 ${
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
        <div className="border-t border-green-500/30 p-4">
          <div className="flex items-center gap-2">
            <span className="text-green-400">$</span>
            <Input
              ref={inputRef}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Robot Framework commands..."
              className="bg-transparent border-green-500/30 text-green-400 placeholder-green-600 focus:border-green-400"
              disabled={isRunning}
            />
            <Button
              size="sm"
              onClick={() => executeCommand(command)}
              disabled={isRunning || !command.trim()}
              className="bg-green-600 hover:bg-green-700 text-black"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Terminal;

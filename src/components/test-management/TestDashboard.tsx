import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Download,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

interface TestMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  executionTime: string;
  successRate: number;
}

interface TestRun {
  id: string;
  name: string;
  status: "passed" | "failed" | "running";
  duration: string;
  timestamp: Date;
  passRate: number;
}

interface TestDashboardProps {
  metrics?: TestMetrics;
  recentRuns?: TestRun[];
  onRefresh?: () => void;
  onExportResults?: () => void;
  onOpenReport?: (runId: string) => void;
  className?: string;
}

const defaultMetrics: TestMetrics = {
  totalTests: 156,
  passedTests: 142,
  failedTests: 14,
  executionTime: "2m 34s",
  successRate: 91.0,
};

const defaultRuns: TestRun[] = [
  {
    id: "1",
    name: "Login Test Suite",
    status: "passed",
    duration: "45s",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    passRate: 100,
  },
  {
    id: "2",
    name: "API Integration Tests",
    status: "failed",
    duration: "1m 23s",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    passRate: 85,
  },
  {
    id: "3",
    name: "UI Regression Tests",
    status: "passed",
    duration: "3m 12s",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    passRate: 94,
  },
  {
    id: "4",
    name: "Performance Tests",
    status: "running",
    duration: "2m 45s",
    timestamp: new Date(),
    passRate: 0,
  },
];

const TestDashboard = ({
  metrics = defaultMetrics,
  recentRuns = defaultRuns,
  onRefresh = () => {},
  onExportResults = () => {},
  onOpenReport = () => {},
  className = "",
}: TestDashboardProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realTimeMetrics, setRealTimeMetrics] = useState(metrics);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (recentRuns.some((run) => run.status === "running")) {
        setRealTimeMetrics((prev) => ({
          ...prev,
          totalTests: prev.totalTests + Math.floor(Math.random() * 3),
          passedTests: prev.passedTests + Math.floor(Math.random() * 2),
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [recentRuns]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "text-green-600 bg-green-50 border-green-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "running":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Test Execution Dashboard
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onExportResults}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Tests
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {realTimeMetrics.totalTests}
            </div>
            <p className="text-xs text-gray-500 mt-1">Executed this session</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Passed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {realTimeMetrics.passedTests}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Success rate: {realTimeMetrics.successRate}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Failed
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {realTimeMetrics.failedTests}
            </div>
            <p className="text-xs text-gray-500 mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Execution Time
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {realTimeMetrics.executionTime}
            </div>
            <p className="text-xs text-gray-500 mt-1">Average duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Success Rate Progress */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Overall Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Session</span>
              <span className="font-medium text-gray-900">
                {realTimeMetrics.successRate}%
              </span>
            </div>
            <Progress value={realTimeMetrics.successRate} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{realTimeMetrics.passedTests} passed</span>
              <span>{realTimeMetrics.failedTests} failed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Test Runs */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Recent Test Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRuns.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(run.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{run.name}</h4>
                    <p className="text-sm text-gray-500">
                      {run.timestamp.toLocaleString()} • {run.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(run.status)}`}
                  >
                    {run.status === "running"
                      ? "Running"
                      : `${run.passRate}% passed`}
                  </span>
                  {run.status !== "running" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenReport(run.id)}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Report
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDashboard;

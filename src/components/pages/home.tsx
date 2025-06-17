import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, Settings, Sun, Moon, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const getThemeIcon = () => {
    switch (theme) {
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b">
        <div className="max-w-[980px] mx-auto flex h-12 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-medium text-xl text-primary">
              Robot Framework Test Manager
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className="text-sm font-light hover:text-primary"
              >
                Dashboard
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8"
            >
              {getThemeIcon()}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
                <DropdownMenuLabel className="text-xs">
                  Settings
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={toggleTheme}
                >
                  {getThemeIcon()}
                  <span className="ml-2">Toggle Theme</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="pt-12">
        {/* Hero section */}
        <section className="py-20 text-center">
          <h2 className="text-5xl font-semibold tracking-tight mb-1 text-foreground">
            Robot Framework Test Manager
          </h2>
          <h3 className="text-2xl font-medium text-primary mb-4">
            Sleek test management interface with real-time execution monitoring
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Execute, monitor, and analyze Robot Framework tests from a
            centralized dashboard with integrated terminal, file browser, and
            real-time reporting capabilities.
          </p>
          <div className="flex justify-center space-x-6 text-xl text-primary">
            <Link
              to="/dashboard"
              className="flex items-center hover:underline hover:opacity-80"
            >
              Explore features <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center hover:underline hover:opacity-80"
            >
              Start testing <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Features section */}
        <section className="py-20 bg-gray-900 text-center">
          <h2 className="text-5xl font-semibold tracking-tight mb-1 text-white">
            Powerful Test Management
          </h2>
          <h3 className="text-2xl font-medium text-green-400 mb-4">
            Everything you need for Robot Framework testing
          </h3>
          <div className="flex justify-center space-x-6 text-xl text-green-400">
            <Link
              to="/dashboard"
              className="flex items-center hover:underline hover:text-green-300"
            >
              Explore features <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/signup"
              className="flex items-center hover:underline hover:text-green-300"
            >
              Start testing <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black border border-green-500/20 p-8 rounded-2xl shadow-sm text-left">
              <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-2 text-white">
                Real-time Dashboard
              </h4>
              <p className="text-gray-400">
                Monitor test execution metrics and historical data with visual
                charts and status indicators.
              </p>
            </div>
            <div className="bg-black border border-green-500/20 p-8 rounded-2xl shadow-sm text-left">
              <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-2 text-white">
                Integrated Terminal
              </h4>
              <p className="text-gray-400">
                Run tests locally with dependency verification and real-time
                output monitoring.
              </p>
            </div>
            <div className="bg-black border border-green-500/20 p-8 rounded-2xl shadow-sm text-left">
              <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v2zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2M7 13h10l-4-8H7l4 8z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-2 text-white">
                File Browser
              </h4>
              <p className="text-gray-400">
                Select test files and output directories with intuitive
                drag-and-drop functionality.
              </p>
            </div>
          </div>
        </section>

        {/* Grid section for other features */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
          <div className="bg-card border rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight mb-1 text-card-foreground">
              One-Click Reports
            </h2>
            <h3 className="text-xl font-medium text-primary mb-4">
              HTML reports and Excel exports
            </h3>
            <div className="flex justify-center space-x-6 text-lg text-primary">
              <Link
                to="/dashboard"
                className="flex items-center hover:underline hover:opacity-80"
              >
                View reports <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center hover:underline hover:opacity-80"
              >
                Try now <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 bg-muted border p-6 rounded-xl shadow-sm max-w-sm mx-auto">
              <div className="space-y-4">
                <div className="h-10 bg-primary/20 border border-primary/30 rounded-md w-full flex items-center justify-center">
                  <span className="text-primary text-sm">📊 HTML Report</span>
                </div>
                <div className="h-10 bg-primary/20 border border-primary/30 rounded-md w-full flex items-center justify-center">
                  <span className="text-primary text-sm">📈 Excel Export</span>
                </div>
                <div className="h-10 bg-primary rounded-md w-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">
                    Generate Report
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight mb-1 text-card-foreground">
              Multi-Theme Support
            </h2>
            <h3 className="text-xl font-medium text-primary mb-4">
              Light, Dark & Green modes
            </h3>
            <div className="flex justify-center space-x-6 text-lg text-primary">
              <Link
                to="/dashboard"
                className="flex items-center hover:underline hover:opacity-80"
              >
                Try themes <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center hover:underline hover:opacity-80"
              >
                Get started <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 bg-muted border p-6 rounded-xl shadow-sm max-w-sm mx-auto text-left">
              <pre className="text-primary text-xs font-mono overflow-x-auto">
                <code>
                  {`// Toggle theme with animation
const toggleTheme = () => {
  setTheme(nextTheme);
  document.body.classList.add(theme);
};

// Smooth transitions included`}
                </code>
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t py-12 text-xs text-muted-foreground">
        <div className="max-w-[980px] mx-auto px-4">
          <div className="border-b pb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium text-sm text-primary mb-4">
                Robot Framework Test Manager
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:underline hover:text-primary"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Examples
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-primary mb-4">
                Testing Tools
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Test Execution
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    File Browser
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Terminal
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Reports
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-primary mb-4">
                Community
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Robot Framework
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-primary mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-4">
            <p>
              Copyright © 2025 Robot Framework Test Manager. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

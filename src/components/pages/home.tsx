import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(0,0,0,0.9)] backdrop-blur-md border-b border-green-500/20">
        <div className="max-w-[980px] mx-auto flex h-12 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-medium text-xl text-green-400">
              Robot Framework Test Manager
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-green-400 text-white"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback className="bg-green-600 text-black">
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-green-500/20 bg-gray-900 text-white shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-green-400">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-green-500/20" />
                    <DropdownMenuItem className="cursor-pointer hover:bg-green-500/10">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-green-500/10">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-green-500/20" />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-green-500/10"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-green-400 text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-green-600 text-black hover:bg-green-500 text-sm px-4 font-medium">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-12">
        {/* Hero section */}
        <section className="py-20 text-center">
          <h2 className="text-5xl font-semibold tracking-tight mb-1 text-white">
            Robot Framework Test Manager
          </h2>
          <h3 className="text-2xl font-medium text-green-400 mb-4">
            Sleek test management interface with real-time execution monitoring
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            Execute, monitor, and analyze Robot Framework tests from a
            centralized dashboard with integrated terminal, file browser, and
            real-time reporting capabilities.
          </p>
          <div className="flex justify-center space-x-6 text-xl text-green-400">
            <Link
              to="/dashboard"
              className="flex items-center hover:underline hover:text-green-300"
            >
              View Dashboard <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/signup"
              className="flex items-center hover:underline hover:text-green-300"
            >
              Get started <ChevronRight className="h-4 w-4" />
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
          <div className="bg-gray-900 border border-green-500/20 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight mb-1 text-white">
              One-Click Reports
            </h2>
            <h3 className="text-xl font-medium text-green-400 mb-4">
              HTML reports and Excel exports
            </h3>
            <div className="flex justify-center space-x-6 text-lg text-green-400">
              <Link
                to="/dashboard"
                className="flex items-center hover:underline hover:text-green-300"
              >
                View reports <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/signup"
                className="flex items-center hover:underline hover:text-green-300"
              >
                Try now <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 bg-black border border-green-500/20 p-6 rounded-xl shadow-sm max-w-sm mx-auto">
              <div className="space-y-4">
                <div className="h-10 bg-green-600/20 border border-green-500/30 rounded-md w-full flex items-center justify-center">
                  <span className="text-green-400 text-sm">📊 HTML Report</span>
                </div>
                <div className="h-10 bg-green-600/20 border border-green-500/30 rounded-md w-full flex items-center justify-center">
                  <span className="text-green-400 text-sm">
                    📈 Excel Export
                  </span>
                </div>
                <div className="h-10 bg-green-600 rounded-md w-full flex items-center justify-center">
                  <span className="text-black text-sm font-medium">
                    Generate Report
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 border border-green-500/20 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight mb-1 text-white">
              Dark/Light Mode
            </h2>
            <h3 className="text-xl font-medium text-green-400 mb-4">
              Smooth theme transitions
            </h3>
            <div className="flex justify-center space-x-6 text-lg text-green-400">
              <Link
                to="/dashboard"
                className="flex items-center hover:underline hover:text-green-300"
              >
                Try themes <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/signup"
                className="flex items-center hover:underline hover:text-green-300"
              >
                Get started <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 bg-black border border-green-500/20 p-6 rounded-xl shadow-sm max-w-sm mx-auto text-left">
              <pre className="text-green-400 text-xs font-mono overflow-x-auto">
                <code>
                  {`// Toggle theme with animation
const toggleTheme = () => {
  setDarkMode(!darkMode);
  document.body.classList.toggle('dark');
};

// Smooth transitions included`}
                </code>
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-green-500/20 py-12 text-xs text-gray-400">
        <div className="max-w-[980px] mx-auto px-4">
          <div className="border-b border-green-500/20 pb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium text-sm text-green-400 mb-4">
                Robot Framework Test Manager
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:underline hover:text-green-300"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    Examples
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-green-400 mb-4">
                Testing Tools
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    Test Execution
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    File Browser
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    Terminal
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    Reports
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-green-400 mb-4">
                Community
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    Robot Framework
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-green-400 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-green-300">
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

import { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import Settings from "./components/pages/settings";
import Terminal from "./components/pages/terminal";
import FileBrowser from "./components/pages/file-browser";
import { Toaster } from "./components/ui/toaster";
import { LoadingScreen } from "./components/ui/loading-spinner";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/file-browser" element={<FileBrowser />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/success" element={<Success />} />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </>
  );
}

function App() {
  return (
    <>
      <Suspense
        fallback={
          <LoadingScreen text="Loading Robot Framework Test Manager..." />
        }
      >
        <AppRoutes />
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;

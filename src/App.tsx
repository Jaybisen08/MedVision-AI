/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [viewMode, setViewMode] = useState<"landing" | "dashboard">("landing");
  const [isDemo, setIsDemo] = useState<boolean>(false);

  const startDashboard = (useDemoData: boolean) => {
    setIsDemo(useDemoData);
    setViewMode("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] antialiased">
      {viewMode === "landing" ? (
        <LandingPage onStart={startDashboard} />
      ) : (
        <Dashboard 
          initialDemo={isDemo} 
          onBackToLanding={() => setViewMode("landing")} 
        />
      )}
    </div>
  );
}

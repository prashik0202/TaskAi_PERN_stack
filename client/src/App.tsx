import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingLayout from "@/pages/landing/LandingLayout";
import AuthLayout from "@/pages/auth/AuthLayout";
import AuthProvider from "@/components/provider/AuthProvider";
import PlatformLayout from "@/pages/platform/PlatformLayout";
const LandingPage = React.lazy(() => import("@/pages/landing/Landing"));
const SignInPage = React.lazy(() => import("@/pages/auth/SignInPage"));
const SignUpPage = React.lazy(() => import("@/pages/auth/SignUpPage"));
const PlatformHome = React.lazy(() => import("@/pages/platform/PlaformHome"));
const SettingsPage = React.lazy(() => import("@/pages/platform/SettingsPage"));
const TaskPage = React.lazy(() => import("@/pages/platform/TaskPage"));

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingLayout>
            <LandingPage />
          </LandingLayout>
        }
      />

      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Route>

      {/* All protected routes */}
      <Route element={<AuthProvider />}>
        <Route element={<PlatformLayout />}>
          <Route path="/platform" element={<PlatformHome />} />
          <Route path="/platform/settings" element={<SettingsPage />} />
          <Route path="/platform/tasks/:projectId" element={<TaskPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;

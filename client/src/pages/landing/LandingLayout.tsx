import React from "react";
import Header from "../../components/Header";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-dvh">
      {/* Header */}
      <Header />
      {children}
      {/* Footer */}
    </div>
  );
};

export default LandingLayout;

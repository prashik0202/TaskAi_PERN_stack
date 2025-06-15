import Navbar from "@/components/Navbar";
import { PlatformContextProvider } from "@/context/PlatformContext";
import { Outlet } from "react-router-dom";

const PlatformLayout = () => {
  return (
    <PlatformContextProvider>
      <div className="min-h-dvh flex flex-col items-center">
        {/* Navbar */}
        <Navbar />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </PlatformContextProvider>
  );
};

export default PlatformLayout;

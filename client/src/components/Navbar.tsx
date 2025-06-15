import type { AppDispatch, RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutUser } from "@/store/auth/authSlice";
import { ModeToggle } from "./mode-toogle";

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    try {
      dispatch(signOutUser());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="p-5 flex flex-row justify-between items-center w-full">
      <div className="hidden md:flex flex-row gap-5 items-baseline">
        <Link to={"/platform"} className="text-2xl text-pretty text-primary">
          TaslAI
        </Link>
        <Link to={"/platform/settings"}>Settings</Link>
        <Link to={"/platform/report"}>Report</Link>
      </div>

      <div className="flex flex-row items-center gap-4">
        <ModeToggle />
        {user && (
          <>
            <Button onClick={handleLogout}>SignOut</Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;

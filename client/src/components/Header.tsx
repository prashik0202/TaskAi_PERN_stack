import { signOutUser } from "@/store/auth/authSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { ModeToggle } from "./mode-toogle";
import { Button } from "./ui/button";

const Header = () => {
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
    <header className="p-4 flex flex-row items-center justify-around">
      <h2 className="text-xl">TaskAI</h2>
      <div className="flex flex-row gap-4">
        <ModeToggle />
        {user ? (
          <Button onClick={handleLogout}>SignOut</Button>
        ) : (
          <Button variant={"default"}>SignIn</Button>
        )}
      </div>
    </header>
  );
};

export default Header;

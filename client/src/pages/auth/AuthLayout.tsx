import { Outlet, useLocation } from "react-router-dom";

const AuthLayout = () => {
  const location = useLocation();
  const pathName = location.pathname;

  return (
    <div className="min-h-dvh flex flex-row justify-center items-center p-10">
      <div className="flex justify-between w-full lg:max-w-3xl rounded-md border shadow-2xl">
        <div className="w-full p-10">
          <h3 className="text-xl">
            {pathName === "/sign-in" ? "SignIn Form" : "SignUp Form"}
          </h3>
          <Outlet />
        </div>
        <div className="hidden lg:block w-full bg-primary/80 p-10">
          {pathName === "/sign-in" ? (
            <>
              <h2 className="text-pretty text-primary-foreground text-3xl">
                SignIn to TaskAI
              </h2>
              <p className="mt-5">Lets Start with productive day</p>
            </>
          ) : (
            <>
              <h2 className="text-pretty text-primary-foreground text-3xl">
                SingUp to Task
              </h2>
              <p className="mt-5">Lets begin with creating your account</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

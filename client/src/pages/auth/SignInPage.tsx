import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoveRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { userSignInSchema, type UserSignInSchemaType } from "@/types/schema";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { signInUser } from "@/store/auth/authSlice";
import { toast } from "sonner";

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<UserSignInSchemaType>({
    resolver: zodResolver(userSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInTestUser = () => {
    setValue("email", "test@gmail.com");
    setValue("password", "12345678");
  };

  const handleFormSubmit = async (data: UserSignInSchemaType) => {
    const signInPromise = dispatch(
      signInUser({
        email: data.email,
        password: data.password,
      })
    ).unwrap(); // this unwraps the result or throws an error

    toast.promise(signInPromise, {
      loading: "Signing in...",
      success: "Signed in successfully!",
      error: "Invalid credentials or server error.",
    });

    try {
      await signInPromise;
      navigate("/platform");
    } catch (error) {
      console.error(error); // toast already handled error
    }
  };

  return (
    <form
      className="w-full mt-5 flex flex-col gap-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input placeholder="john@gmail.com" {...register("email")} />
        {errors.email && (
          <span className="text-red-500 text-xs visible">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Your passwod"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-red-500 text-xs visible">
            {errors.password.message}
          </span>
        )}
      </div>

      <span className="text-sm">
        Dont have account?{" "}
        <Link className="text-blue-500" to={"/sign-up"}>
          SignUp
        </Link>
      </span>

      <Button className="mt-5 cursor-pointer" type="submit">
        SignIn <MoveRight />
      </Button>

      <Button
        className="mt-5 cursor-pointer"
        type="button"
        onClick={signInTestUser}
      >
        Test User
      </Button>
    </form>
  );
};

export default SignInPage;

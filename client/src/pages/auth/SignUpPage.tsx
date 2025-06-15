import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/store/auth/authSlice";
import type { AppDispatch } from "@/store/store";
import { type UserSchemaType, userSchema } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data: UserSchemaType) => {
    const signUpPromise = dispatch(
      signUpUser({
        email: data.email,
        password: data.password,
        name: data.name,
      })
    ).unwrap(); // this unwraps the result or throws an error

    toast.promise(signUpPromise, {
      loading: "Signup...",
      success: "Signed in successfully!",
      error: "Invalid credentials or server error.",
    });

    try {
      await signUpPromise;
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
        <Label>Name</Label>
        <Input placeholder="John Walker" {...register("name")} />
        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name?.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input placeholder="john@gmail.com" {...register("email")} />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email?.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Your password"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password?.message}
          </span>
        )}
      </div>

      <span className="text-sm">
        Already have account?{" "}
        <Link className="text-blue-500" to={"/sign-in"}>
          SignIn
        </Link>
      </span>

      <Button className="mt-5" type="submit">
        SignUp
      </Button>
    </form>
  );
};

export default SignUpPage;

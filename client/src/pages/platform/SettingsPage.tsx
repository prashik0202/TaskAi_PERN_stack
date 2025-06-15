import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/store/auth/authSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { userUpdateSchema, type UserUpdateType } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const SettingsPage = () => {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<UserUpdateType>({
    defaultValues: {
      email: user?.email,
      name: user?.name,
    },
    resolver: zodResolver(userUpdateSchema),
  });

  const handleUpdateUser = async (data: UserUpdateType) => {
    console.log(data);

    try {
      if (user) {
        const updateUserFn = dispatch(
          updateUser({
            email: data.email,
            name: data.name,
            id: user.id,
          })
        ).unwrap();

        toast.promise(updateUserFn, {
          loading: "Updating User...",
          success: "Updated successfully!",
          error: "Invalid credentials or server error.",
        });

        await updateUserFn;
      } else {
        toast.error("userId present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="w-full p-5 border rounded-md shadow-md">
        <h3 className="text-xl text-primary">Edit Profile Settings</h3>

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(handleUpdateUser)}
        >
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input placeholder="John Walker" {...register("name")} />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name?.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input placeholder="john@gmail.com" {...register("email")} />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email?.message}
              </span>
            )}
          </div>

          <Button className="w-fit" disabled={!isDirty || loading}>
            Update
          </Button>
        </form>
      </div>

      <div className="w-full p-5 border rounded-md shadow-md">
        <h3>Update Password</h3>
      </div>
    </div>
  );
};

export default SettingsPage;

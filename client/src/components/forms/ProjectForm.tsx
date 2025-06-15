import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProjectSchema, type ProjectSchemaType } from "@/types/schema";
import type { Project } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { projectApiService } from "@/services/projectApiService";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import { usePlatform } from "@/context/PlatformContext";
import { Loader } from "lucide-react";

interface ProjectForm {
  trigger: React.ReactNode;
  project?: Project;
}

export function ProjectForm({ trigger, project }: ProjectForm) {
  const { user } = useSelector((state: RootState) => state.user);
  const {
    dispatch,
    state: { loading },
  } = usePlatform();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<ProjectSchemaType>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: project
      ? {
          projectName: "",
          description: "",
        }
      : undefined,
  });

  const [open, setOpen] = useState<boolean>(false);

  const handleFormSubmit = async (data: ProjectSchemaType) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      if (user) {
        const newProject = await projectApiService.createProject({
          description: data.description,
          projectName: data.projectName,
          isArchived: false,
          isPublic: true,
          userId: user.id,
        });

        dispatch({ type: "ADD_PROJECT", payload: newProject.data });
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to create Project!");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.success("Project created successfully!");
      reset();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : <Button variant="outline">Open Dialog</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-5">
            <div className="grid gap-3">
              <Label htmlFor="projectName">Project Name</Label>
              <Input id="projectName" {...register("projectName")} />
              {errors.projectName && (
                <span className="text-red-500 text-xs">
                  {errors.projectName.message}
                </span>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                className="resize-none"
              />
              {errors.description && (
                <span className="text-red-500 text-xs">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter className="mt-10">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

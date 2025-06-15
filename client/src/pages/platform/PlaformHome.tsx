import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Calendar, EllipsisVertical } from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";
import { projectApiService } from "@/services/projectApiService";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { RootState } from "@/store/store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/types/types";

const PlatformHome = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const {
    state: { error, loading, project },
    dispatch,
  } = usePlatform();

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!user) return;
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_PROJECTS", payload: [] });
        const response = await projectApiService.getProjectsOfUser(user.id);
        dispatch({ type: "SET_PROJECTS", payload: response.data });
        dispatch({ type: "SET_ERROR", payload: "" });
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Unable to fetch Projects 😔");
          dispatch({ type: "SET_ERROR", payload: error.message });
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchUserProjects();
  }, [user, dispatch]);

  return (
    <div className="flex flex-col w-full p-10">
      {user && (
        <h2 className="text-md font-semibold">Welcome! {user.name} 👋</h2>
      )}

      <div className="flex flex-col gap-1">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div>
            <h3 className="text-md">Your Projects</h3>
            <p className="text-gray-500 text-xs">
              You can create, view, and manage your projects here.
            </p>
          </div>

          <ProjectForm
            trigger={<Button className="w-fit mt-5">Create Project</Button>}
          />
        </div>

        <div className="mt-5">
          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(6)].map((_, index) => (
                <Skeleton className="w-full h-36 bg-neutral-300" key={index} />
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-lg text-red-400">{error}!</p>}

          {/* Display Projects */}
          {project && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {project.map((proj) => (
                <Card
                  key={proj.id}
                  className="justify-between bg-card border rounded-lg shadow-lg transition delay-0 duration-150 ease-in-out hover:scale-[101%] cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {proj.projectName}
                    </CardTitle>
                    <CardDescription className="text-neutral-400 line-clamp-2 overflow-hidden text-ellipsis">
                      {proj.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex flex-row items-center gap-10 justify-between">
                    <p className="text-muted-foreground text-sm flex flex-row gap-1 items-center">
                      <Calendar className="h-4 w-4 text-sky-500" />{" "}
                      {new Date(proj.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Status:{" "}
                      {proj.isArchived ? (
                        <span>Archived</span>
                      ) : (
                        <span className="text-emerald-500">Active</span>
                      )}
                    </p>
                    <OptionsMenu
                      trigger={
                        <Button
                          variant={"link"}
                          className="text-muted-foreground hover:text-neutral-200 cursor-pointer active:outline-none"
                        >
                          <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      }
                      project={proj}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformHome;

interface OptionsMenuProps {
  trigger?: React.ReactNode;
  project: Project;
}

const OptionsMenu = ({ trigger, project }: OptionsMenuProps) => {
  const navigate = useNavigate();

  const handleViewProject = (projectId: string) => {
    // Navigate to the project tasks page
    navigate(`/platform/tasks/${projectId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="ghost" className="h-8 w-8 p-0">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleViewProject(project.id)}>
          View Project
        </DropdownMenuItem>
        <DropdownMenuItem>Edit Project</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete Project</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

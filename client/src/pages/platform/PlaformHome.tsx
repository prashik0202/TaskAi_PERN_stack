import { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePlatform } from "@/context/PlatformContext";
import { projectApiService } from "@/services/projectApiService";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { RootState } from "@/store/store";
import ProjectCard from "@/components/ProjectCard";

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
          dispatch({
            type: "SET_ERROR",
            payload: "Unable to fetch Projects 😔",
          });
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
          {project && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {project.map((proj) => (
                <ProjectCard project={proj} key={proj.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformHome;

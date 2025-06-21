import { useEffect, useState } from "react";
import { projectApiService } from "@/services/projectApiService";
import type { Project } from "@/types/types";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Kanban from "@/components/kanban_v2/Kanban";
import { axiosInstance } from "@/config/axiosConfig";
import { usePlatform } from "@/context/PlatformContext";
import TaskForm from "@/components/forms/TaskForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TaskStackGraph from "@/components/analytics/TaskAnalysis";

const TaskPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const {
    state: { error, tasks, loading },
    dispatch,
  } = usePlatform();

  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async (projectId: string) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const ProjectDetails =
          await projectApiService.getProjectById(projectId);
        if (ProjectDetails.status === 200) {
          setProject(ProjectDetails.data);
        } else {
          toast.error("Something Went wrong!");
        }
      } catch (error) {
        if (error instanceof Error) {
          dispatch({ type: "SET_ERROR", payload: error.message });
        }
        navigate("/platform");
        toast.error("Unbable to fetch Exercise Data");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    const fetchTask = async (projectId: string) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const res = await axiosInstance.get(`/api/tasks/${projectId}`);
        dispatch({ type: "SET_TASKS", payload: res.data });
      } catch (error) {
        toast.error("Error while fetcing tasks!");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    if (projectId) {
      Promise.all([fetchProject(projectId), fetchTask(projectId)]);
    }
  }, [projectId, navigate, dispatch]);

  return (
    <div className="px-10 pb-20">
      <div className="flex gap-5 items-center">
        {project && <h2 className="text-md">{project?.projectName}</h2>}
        {error && <span className="text-lg text-red-500">{error}</span>}
        {loading && !project && (
          <Skeleton className="h-6 w-40 bg-neutral-400" />
        )}
        {projectId && (
          <TaskForm
            trigger={
              <Button size={"sm"} variant={"ghost"} className="text-primary">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            }
          />
        )}
      </div>

      {/* Kanban Board */}
      <div className="w-full mt-5 grid grid-cols-3 gap-5">
        {/* <Kanban /> */}
        <div className="w-full col-span-2">
          {loading && <h2>Loading...</h2>}
          {tasks && !loading && <Kanban tasks={tasks} />}
        </div>
        <div className="w-full col-span-1 h-fit bg-accent rounded-md p-5 flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Task Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <h2>Loading...</h2>}
              {tasks && !loading && (
                <div className="grid grid-cols-2">
                  <TaskStackGraph tasks={tasks} />
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Create Tasks</CardTitle>
              <CardDescription>
                Create all your tasks at once by uploading an Excel file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h2 className="text-primary">Comming Soon...</h2>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;

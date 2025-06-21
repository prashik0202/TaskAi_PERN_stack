import Alert from "@/components/alert";
import {
  Card,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, ExternalLink, Pen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlatform } from "@/context/PlatformContext";
import { projectApiService } from "@/services/projectApiService";
import type { Project } from "@/types/types";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ProjectForm } from "./forms/ProjectForm";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { dispatch } = usePlatform();

  const navigate = useNavigate();
  const deleteProject = async (projectId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await projectApiService.deleteProject(projectId);
      dispatch({ type: "DELETE_PROJECT", payload: projectId });
    } catch (error) {
      toast.error("Unable to delete project");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <Card
      key={project.id}
      className="justify-between bg-card border rounded-lg shadow-lg transition delay-0 duration-150 ease-in-out hover:scale-[101%] cursor-pointer"
      onDoubleClick={() => navigate(`/platform/tasks/${project.id}`)}
    >
      <CardHeader>
        <CardTitle className="text-xl">{project.projectName}</CardTitle>
        <CardDescription className="text-neutral-400 line-clamp-2 overflow-hidden text-ellipsis">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row items-center gap-10 justify-between">
        <p className="text-muted-foreground text-xs flex flex-row gap-1 items-center">
          <Calendar className="h-4 w-4 text-sky-500" />{" "}
          {new Date(project.createdAt).toLocaleDateString()}
        </p>
        <p className="text-muted-foreground text-xs">
          Status:{" "}
          {project.isArchived ? (
            <span>Archived</span>
          ) : (
            <span className="text-emerald-500">Active</span>
          )}
        </p>
        <div className="flex flex-row items-center justify-center gap-0">
          <ProjectForm
            trigger={
              <Button variant={"ghost"} size={"sm"}>
                <Pen className="h-4 w-4 text-sky-400" />
              </Button>
            }
            project={project}
          />
          <Alert
            trigger={
              <Button
                variant={"ghost"}
                size={"sm"}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            handleContinue={() => deleteProject(project.id)}
          >
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </Alert>
          <Button variant={"ghost"} size={"sm"}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;

import type { Task } from "@/types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "../ui/card";
import { ExternalLinkIcon, GripVertical, Pencil, Trash2 } from "lucide-react";
import { getPriorityColor } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Button } from "../ui/button";
import TaskForm from "../forms/TaskForm";
import Alert from "../alert";
import { taskService } from "@/services/taskService";
import { usePlatform } from "@/context/PlatformContext";
import { toast } from "sonner";

const TaskCard = ({ task }: { task: Task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  const { dispatch } = usePlatform();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      dispatch({ type: "DELETE_TASK", payload: taskId });
    } catch (error) {
      toast.error("Unalble to delete task");
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab py-2 active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="px-3 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-card font-medium dark:text-card-foreground">
              {task.taskName}
            </p>
            <p className="text-[11px] font-light">{task.description}</p>
            <Badge
              className={`mt-2 text-xs ${getPriorityColor(task.priority)} text-black font-bold`}
            >
              {task.priority}
            </Badge>
          </div>
          <GripVertical className="h-4 w-4 text-white flex-shrink-0" />
        </div>
        <div className="flex justify-between gap-2 items-center">
          <p className="text-xs">Due : {format(task.dueDate, "yyyy-MM-dd")}</p>
          <div>
            <TaskForm
              trigger={
                <Button variant={"ghost"} size={"sm"}>
                  <Pencil className="h-4 w-4 text-neutral-600" />
                </Button>
              }
              task={task}
            />
            <Alert
              handleContinue={() => handleDeleteTask(task.id)}
              trigger={
                <Button variant={"ghost"} size={"sm"}>
                  <Trash2 className="h-4 w-4 text-neutral-600" />
                </Button>
              }
            >
              Are you sure want to delete task
            </Alert>
            <Button variant={"ghost"} size={"sm"}>
              <ExternalLinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

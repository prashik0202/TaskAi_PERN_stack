import type { Task } from "@/types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "../ui/card";
import { EllipsisVertical, GripVertical } from "lucide-react";
import {
  getPriorityColor,
} from "@/lib/utils";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Button } from "../ui/button";

const TaskCard = ({ task }: { task: Task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
            <Badge className={`mt-2 text-xs ${getPriorityColor(task.priority)} text-black font-bold`}>
              {task.priority}
            </Badge>
          </div>
          <GripVertical className="h-4 w-4 text-white flex-shrink-0" />
        </div>
        <div className="flex justify-between gap-2 items-center"> 
          <p className="text-xs">
            Due : {format(task.dueDate, 'yyyy-MM-dd')}
          </p>
          <Button variant={"ghost"}>
            <EllipsisVertical />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

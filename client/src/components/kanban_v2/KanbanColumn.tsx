import type { Column, Task } from "@/types/types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { Badge } from "../ui/badge";

const KanbanColumn = ({ column, tasks }: { column: Column; tasks: Task[] }) => {
  const columnTasks = tasks.filter((task) => task.status === column.status);
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full rounded-lg p-2 bg-accent border border-card-foreground/10 min-h-[800px] scroll-auto`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs">{column.columnName}</h3>
        <Badge variant="secondary">{columnTasks.length}</Badge>
      </div>
      <SortableContext
        items={columnTasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 flex-1">
          {columnTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;
